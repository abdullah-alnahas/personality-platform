<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaController extends Controller
{
    /**
     * Allowed image MIME types for the picker uploader. SVG is intentionally
     * omitted — SVG can carry inline scripts and serving raw SVG from the
     * public disk would create a stored-XSS sink.
     */
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
    ];

    /**
     * Map of accepted MIME → canonical extension. The stored extension is
     * derived from the validated content type, never from the client-supplied
     * filename, to defeat polyglot uploads (e.g. JPEG header + .phtml ext).
     */
    private const MIME_TO_EXTENSION = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/gif'  => 'gif',
        'image/webp' => 'webp',
    ];

    /**
     * Public disk subdirectory for picker uploads (admin-managed images).
     */
    private const UPLOAD_PATH = 'uploads';

    /**
     * Display a listing of the media items (full Inertia page).
     */
    public function index(Request $request): Response
    {
        $this->authorize("manage media");

        $items = $this->collectPickerItems();
        $perPage = 20;
        $page = max(1, (int) $request->query('page', 1));
        $offset = ($page - 1) * $perPage;
        $slice = array_slice($items, $offset, $perPage);
        $total = count($items);

        $paginated = [
            'data' => $slice,
            'current_page' => $page,
            'last_page' => max(1, (int) ceil($total / $perPage)),
            'total' => $total,
            'per_page' => $perPage,
        ];

        return Inertia::render("Admin/Media/Index", [
            "mediaItems" => $paginated,
            "can" => [
                "delete_media" => $request->user()->can("manage media"),
            ],
        ]);
    }

    /**
     * Lightweight JSON listing for the inline MediaPicker modal.
     */
    public function picker(Request $request): JsonResponse
    {
        $this->authorize("manage media");

        return response()->json([
            'items' => $this->collectPickerItems(),
        ]);
    }

    /**
     * Upload a new image asset and return the public URL.
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize("manage media");

        $validated = $request->validate([
            'file' => [
                'required',
                'file',
                'max:' . config('media.image.max_kb', 10240),
                'mimetypes:' . implode(',', self::ALLOWED_MIME_TYPES),
            ],
        ]);

        $file = $validated['file'];

        $mime = (string) $file->getMimeType();
        $extension = self::MIME_TO_EXTENSION[$mime] ?? null;
        if ($extension === null) {
            // Defence in depth — the validator should have rejected this already.
            return response()->json(['message' => 'Unsupported image type.'], 422);
        }

        $safeBase = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) ?: 'image';
        $filename = sprintf(
            '%s-%s.%s',
            substr($safeBase, 0, 60),
            Str::random(6),
            $extension
        );

        $path = $file->storeAs(
            self::UPLOAD_PATH . '/' . date('Y/m'),
            $filename,
            ['disk' => 'public']
        );

        // Re-encode JPEG/PNG/WebP through GD to strip EXIF (GPS, camera, timestamps).
        // GIF skipped — no EXIF, animation would be lost. Rotation pre-applied for
        // JPEG so the visual orientation survives the metadata strip.
        $absolute = Storage::disk('public')->path($path);
        $this->stripImageMetadata($absolute, $mime);

        return response()->json([
            'url' => Storage::disk('public')->url($path),
            'path' => $path,
            'name' => $file->getClientOriginalName(),
            'size' => filesize($absolute) ?: $file->getSize(),
            'mime_type' => $mime,
        ], 201);
    }

    /**
     * Re-encode the image at the given path to drop all metadata (EXIF, IPTC,
     * XMP, color profiles). Pre-applies EXIF rotation for JPEGs so the picture
     * does not flip after metadata is dropped. Silently no-ops on GIF and on
     * GD failures (the original upload is still served — better than 500ing).
     */
    private function stripImageMetadata(string $absolute, string $mime): void
    {
        if (!is_file($absolute) || $mime === 'image/gif') {
            return;
        }

        try {
            $image = match ($mime) {
                'image/jpeg' => @imagecreatefromjpeg($absolute),
                'image/png'  => @imagecreatefrompng($absolute),
                'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($absolute) : false,
                default      => false,
            };

            if (!$image) {
                return;
            }

            // Apply EXIF orientation only for JPEG (PNG/WebP rarely carry it).
            if ($mime === 'image/jpeg' && function_exists('exif_read_data')) {
                $exif = @exif_read_data($absolute);
                $orientation = $exif['Orientation'] ?? 1;
                $rotation = match ($orientation) {
                    3 => 180,
                    6 => -90,
                    8 => 90,
                    default => 0,
                };
                if ($rotation !== 0) {
                    $rotated = @imagerotate($image, $rotation, 0);
                    if ($rotated) {
                        imagedestroy($image);
                        $image = $rotated;
                    }
                }
            }

            if ($mime === 'image/png' || $mime === 'image/webp') {
                imagealphablending($image, false);
                imagesavealpha($image, true);
            }

            $ok = match ($mime) {
                'image/jpeg' => imagejpeg($image, $absolute, 85),
                'image/png'  => imagepng($image, $absolute, 6),
                'image/webp' => function_exists('imagewebp') && imagewebp($image, $absolute, 85),
                default      => false,
            };
            unset($ok);
            imagedestroy($image);
        } catch (\Throwable $e) {
            // Don't fail the upload because the metadata strip blew up; log and move on.
            Log::warning('Image metadata strip failed', ['path' => $absolute, 'error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified media item from storage.
     *
     * Two delete vectors are supported:
     *   1. Spatie Media model bound via {medium} (numeric route binding).
     *   2. Picker-upload deletion via signed POST body containing a path that
     *      MUST: live under the configured uploads/ prefix, contain no
     *      traversal segments, and resolve to an existing file on the public
     *      disk. The previous query-string `?path=` form has been removed
     *      because it lacked CSRF and audit-logging guardrails.
     */
    public function destroy(Request $request, ?Media $medium = null): RedirectResponse
    {
        $this->authorize("manage media");

        if ($medium && $medium->exists) {
            $modelType = $medium->model_type;
            $modelId   = $medium->model_id;
            $medium->delete();
            Log::info('media.delete.spatie', [
                'media_id' => $medium->id,
                'model_type' => $modelType,
                'model_id' => $modelId,
                'user_id' => $request->user()?->id,
            ]);

            return redirect()
                ->route("admin.media.index")
                ->with("success", __("Media item deleted successfully."));
        }

        $rawPath = (string) $request->input('path', '');
        $sanitised = $this->sanitiseUploadPath($rawPath);

        if ($sanitised !== null && Storage::disk('public')->exists($sanitised)) {
            Storage::disk('public')->delete($sanitised);
            Log::info('media.delete.picker', [
                'path' => $sanitised,
                'user_id' => $request->user()?->id,
            ]);
        }

        return redirect()
            ->route("admin.media.index")
            ->with("success", __("Media item deleted successfully."));
    }

    /**
     * Validate a picker upload path. Returns the canonical path or null when
     * the input violates any constraint (wrong prefix, traversal, absolute,
     * NUL byte, or extension not on the allow list).
     */
    private function sanitiseUploadPath(string $rawPath): ?string
    {
        if ($rawPath === '') {
            return null;
        }
        if (str_contains($rawPath, "\0")) {
            return null;
        }
        // Reject absolute paths, scheme prefixes, and traversal sequences.
        if (
            str_starts_with($rawPath, '/') ||
            preg_match('#(^|/)\.\.(/|$)#', $rawPath) === 1 ||
            preg_match('#^[a-z][a-z0-9+.-]*://#i', $rawPath) === 1
        ) {
            return null;
        }
        $expectedPrefix = self::UPLOAD_PATH . '/';
        if (! str_starts_with($rawPath, $expectedPrefix)) {
            return null;
        }
        $extension = strtolower(pathinfo($rawPath, PATHINFO_EXTENSION));
        if (! in_array($extension, self::MIME_TO_EXTENSION, true)) {
            return null;
        }
        return $rawPath;
    }

    /**
     * Build a unified list combining picker uploads (public disk) and
     * Spatie media-library items so the picker shows everything available.
     *
     * @return array<int, array<string, mixed>>
     */
    private function collectPickerItems(): array
    {
        $items = [];

        // Public-disk uploads ----------------------------------------------------
        $disk = Storage::disk('public');
        if ($disk->exists(self::UPLOAD_PATH)) {
            foreach ($disk->allFiles(self::UPLOAD_PATH) as $path) {
                $mime = $disk->mimeType($path) ?: 'application/octet-stream';
                if (!in_array($mime, self::ALLOWED_MIME_TYPES, true)) {
                    continue;
                }
                $items[] = [
                    'id' => 'upload:' . md5($path),
                    'source' => 'upload',
                    'path' => $path,
                    'name' => basename($path),
                    'file_name' => basename($path),
                    'mime_type' => $mime,
                    'size' => $disk->size($path),
                    'url' => $disk->url($path),
                    'thumb_url' => $disk->url($path),
                    'created_at' => date('Y-m-d', $disk->lastModified($path)),
                ];
            }
        }

        // Spatie media-library items --------------------------------------------
        Media::latest()->get()->each(function ($media) use (&$items) {
            $items[] = [
                'id' => $media->id,
                'source' => 'media-library',
                'name' => $media->name,
                'file_name' => $media->file_name,
                'mime_type' => $media->mime_type,
                'size' => $media->size,
                'url' => $media->getFullUrl(),
                'thumb_url' => $media->hasGeneratedConversion('thumbnail')
                    ? $media->getFullUrl('thumbnail')
                    : $media->getFullUrl(),
                'created_at' => $media->created_at?->toDateString(),
                'collection_name' => $media->collection_name,
                'model_type' => $media->model_type,
                'model_id' => $media->model_id,
            ];
        });

        // Newest first (best-effort lexicographic on created_at)
        usort($items, fn($a, $b) => strcmp((string) $b['created_at'], (string) $a['created_at']));

        return $items;
    }
}
