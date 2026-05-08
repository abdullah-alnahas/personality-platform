<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaController extends Controller
{
    /**
     * Allowed image MIME types for the picker uploader.
     */
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
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
                'max:10240', // 10 MB
                'mimetypes:' . implode(',', self::ALLOWED_MIME_TYPES),
            ],
        ]);

        $file = $validated['file'];
        $extension = strtolower($file->getClientOriginalExtension() ?: 'bin');
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

        return response()->json([
            'url' => Storage::disk('public')->url($path),
            'path' => $path,
            'name' => $file->getClientOriginalName(),
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ], 201);
    }

    /**
     * Remove the specified media item from storage.
     *
     * Accepts either a Spatie Media model id (numeric route binding) or a
     * picker upload path supplied via ?path=uploads/... in the request.
     */
    public function destroy(Request $request, ?Media $medium = null): RedirectResponse
    {
        $this->authorize("manage media");

        if ($medium && $medium->exists) {
            $medium->delete();
        } elseif ($path = $request->query('path')) {
            // Only allow deleting paths under the uploads/ prefix to prevent escaping.
            if (str_starts_with($path, self::UPLOAD_PATH . '/') && Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }

        return redirect()
            ->route("admin.media.index")
            ->with("success", __("Media item deleted successfully."));
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
