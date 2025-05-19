<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentItem;
use App\Models\ContentCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Admin\StoreContentItemRequest;
use App\Http\Requests\Admin\UpdateContentItemRequest;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse; // Aliased to avoid conflict with Illuminate\Http\Response
use Illuminate\Support\Facades\Gate; // For authorization

/**
 * Handles CRUD operations for Content Items in the Admin panel.
 */
class ContentItemController extends Controller
{
    /**
     * Display a listing of the content items.
     *
     * @return InertiaResponse
     */
    public function index(): InertiaResponse
    {
        Gate::authorize("manage content items"); // Or $this->authorize('viewAny', ContentItem::class); if Policy exists

        $items = ContentItem::with([
            "category:id,name", // Eager load category name and id
            "author:id,name", // Eager load author name and id
            "media" => fn($query) => $query->where(
                "collection_name",
                "featured_image"
            ), // Only featured image media
        ])
            ->latest("publish_date") // Order by publish date by default
            ->paginate(15)
            ->withQueryString(); // Append query strings to pagination links

        // Transform data for the frontend
        $items->through(
            fn(ContentItem $item) => [
                // Type hint $item
                "id" => $item->id,
                "title" => $item->getTranslations("title"),
                "slug" => $item->slug,
                "status" => $item->status,
                "publish_date" => $item->publish_date?->toDateString(), // Format date
                "category_name" => $item->category?->getTranslations("name"),
                "author_name" => $item->author?->name,
                "featured_image_thumb_url" =>
                    $item->thumbnail_featured_image_url, // Use accessor
                "featured_image_url" => $item->original_featured_image_url, // Use accessor
                "created_at" => $item->created_at->toDateTimeString(),
                "updated_at" => $item->updated_at->toDateTimeString(),
            ]
        );

        return Inertia::render("Admin/ContentItems/Index", [
            "items" => $items,
            "can" => [
                // Pass relevant permissions for UI conditional rendering
                "create_item" => Auth::user()->can("manage content items"), // Example, could be more granular
                "edit_item" => Auth::user()->can("manage content items"),
                "delete_item" => Auth::user()->can("manage content items"),
            ],
        ]);
    }

    /**
     * Show the form for creating a new content item.
     *
     * @return InertiaResponse
     */
    public function create(): InertiaResponse
    {
        Gate::authorize("manage content items");

        return Inertia::render("Admin/ContentItems/Form", [
            "item" => null, // No item data for create form
            "categories" => ContentCategory::orderByTranslatable("name")->get([
                "id",
                "name",
            ]), // Pass categories for select dropdown
            "featured_image_url" => null, // No existing image for create form
            "activeLanguages" => config("translatable.locales"), // Pass active languages for translatable fields
        ]);
    }

    /**
     * Store a newly created content item in storage.
     *
     * @param  StoreContentItemRequest  $request
     * @return RedirectResponse
     */
    public function store(StoreContentItemRequest $request): RedirectResponse
    {
        // Authorization is handled by StoreContentItemRequest

        $validatedData = $request->validated();
        $validatedData["user_id"] = Auth::id(); // Assign current user as author

        // Unset image fields as they are handled separately by MediaLibrary
        unset($validatedData["featured_image"]);

        $item = ContentItem::create($validatedData);

        // Handle featured image upload if present
        if (
            $request->hasFile("featured_image") &&
            $request->file("featured_image")->isValid()
        ) {
            $item
                ->addMediaFromRequest("featured_image")
                ->toMediaCollection("featured_image");
        }

        return redirect()
            ->route("admin.content-items.index")
            ->with("success", "Content item created successfully.");
    }

    /**
     * Display the specified content item (redirects to edit).
     *
     * @param  ContentItem  $content_item The content item instance (route model binding).
     * @return RedirectResponse
     */
    public function show(ContentItem $content_item): RedirectResponse
    {
        Gate::authorize("manage content items"); // Or 'view' if a policy exists
        return redirect()->route("admin.content-items.edit", $content_item);
    }

    /**
     * Show the form for editing the specified content item.
     *
     * @param  ContentItem  $content_item
     * @return InertiaResponse
     */
    public function edit(ContentItem $content_item): InertiaResponse
    {
        Gate::authorize("manage content items"); // Or 'update' permission via policy on $content_item
        $content_item->load("media", "category:id,name"); // Eager load necessary relations

        return Inertia::render("Admin/ContentItems/Form", [
            "item" => $content_item->append(
                [
                    // "original_featured_image_url", // Already appended via $appends in model
                    // "thumbnail_featured_image_url",
                ] // Append accessors if not automatically appended globally
            ),
            "categories" => ContentCategory::orderByTranslatable("name")->get([
                "id",
                "name",
            ]),
            "featured_image_url" => $content_item->original_featured_image_url, // Use accessor
            "activeLanguages" => config("translatable.locales"),
        ]);
    }

    /**
     * Update the specified content item in storage.
     *
     * @param  UpdateContentItemRequest  $request
     * @param  ContentItem  $content_item
     * @return RedirectResponse
     */
    public function update(
        UpdateContentItemRequest $request,
        ContentItem $content_item
    ): RedirectResponse {
        // Authorization is handled by UpdateContentItemRequest

        $validatedData = $request->validated();
        unset($validatedData["featured_image"]);
        unset($validatedData["remove_featured_image"]);

        $content_item->update($validatedData);

        // Handle featured image update/removal
        if ($request->boolean("remove_featured_image")) {
            $content_item->clearMediaCollection("featured_image");
        } elseif (
            $request->hasFile("featured_image") &&
            $request->file("featured_image")->isValid()
        ) {
            // Replace existing image by clearing collection first, then adding new one
            $content_item->clearMediaCollection("featured_image");
            $content_item
                ->addMediaFromRequest("featured_image")
                ->toMediaCollection("featured_image");
        }

        return redirect()
            ->route("admin.content-items.index")
            ->with("success", "Content item updated successfully.");
    }

    /**
     * Remove the specified content item from storage.
     *
     * @param  ContentItem  $content_item
     * @return RedirectResponse
     */
    public function destroy(ContentItem $content_item): RedirectResponse
    {
        Gate::authorize("manage content items"); // Or 'delete' permission via policy on $content_item
        $content_item->delete(); // Soft delete

        return redirect()
            ->route("admin.content-items.index")
            ->with("success", "Content item deleted successfully.");
    }
}
