<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media; // Import the Media model

class MediaController extends Controller
{
    /**
     * Display a listing of the media items.
     */
    public function index(Request $request): Response
    {
        $this->authorize("manage media");

        $mediaItems = Media::latest()
            ->paginate(20) // Adjust pagination size as needed
            ->withQueryString();

        // Optionally transform data for the frontend if needed
        $mediaItems->through(
            fn($media) => [
                "id" => $media->id,
                "name" => $media->name,
                "file_name" => $media->file_name,
                "mime_type" => $media->mime_type,
                "size" => $media->size, // Size in bytes
                "url" => $media->getFullUrl(),
                "thumb_url" => $media->hasGeneratedConversion("thumbnail")
                    ? $media->getFullUrl("thumbnail")
                    : $media->getFullUrl(), // Assuming a 'thumbnail' conversion
                "created_at" => $media->created_at->toFormattedDateString(),
                "collection_name" => $media->collection_name,
                "model_type" => $media->model_type, // To know what it's attached to
                "model_id" => $media->model_id,
            ]
        );

        return Inertia::render("Admin/Media/Index", [
            "mediaItems" => $mediaItems,
            "can" => [
                // Define permissions for frontend conditional rendering
                "delete_media" => $request->user()->can("manage media"), // Simplified
            ],
        ]);
    }

    /**
     * Remove the specified media item from storage.
     */
    public function destroy(Request $request, Media $medium): RedirectResponse
    {
        // Route model binding for Media
        // Route model binding for Media
        $this->authorize("manage media");

        // The $medium variable is already an instance of the Media model due to route model binding
        $medium->delete();

        return redirect()
            ->route("admin.media.index")
            ->with("success", "Media item deleted successfully.");
    }
}
