<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentItem;
use App\Models\ContentCategory; // Ensure this is imported
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth; // Ensure this is imported
use App\Http\Requests\Admin\StoreContentItemRequest;
use App\Http\Requests\Admin\UpdateContentItemRequest;
use Inertia\Inertia;
use Inertia\Response;

class ContentItemController extends Controller
{
    public function index(): Response
    {
        // Gate check is preferred over direct auth()->user()->can() in controller if policies are set up
        // For now, assuming 'manage content items' permission exists and is sufficient via middleware or this check.
        // $this->authorize('viewAny', ContentItem::class);

        $items = ContentItem::with([
            "category:id,name",
            "author:id,name",
            "media" => fn($query) => $query->where(
                "collection_name",
                "featured_image"
            ),
        ])
            ->latest("publish_date") // Consider latest('updated_at') or latest('id') for more general "latest"
            ->paginate(15)
            ->withQueryString();

        $items->through(
            fn($item) => [
                "id" => $item->id,
                "title" => $item->getTranslations("title"),
                "slug" => $item->slug,
                "status" => $item->status,
                "publish_date" => $item->publish_date?->toDateString(),
                "category_name" => $item->category?->getTranslations("name"), // Default locale will be picked by getTranslatedField
                "author_name" => $item->author?->name,
                "featured_image_thumb_url" => $item->getFirstMediaUrl(
                    "featured_image",
                    "thumbnail"
                ),
                "featured_image_url" => $item->getFirstMediaUrl(
                    "featured_image"
                ),
                "created_at" => $item->created_at->toDateTimeString(),
                "updated_at" => $item->updated_at->toDateTimeString(),
            ]
        );

        return Inertia::render("Admin/ContentItems/Index", [
            "items" => $items,
            "can" => [
                "create_item" => auth()->user()->can("manage content items"), // Example
                "edit_item" => auth()->user()->can("manage content items"),
                "delete_item" => auth()->user()->can("manage content items"),
            ],
        ]);
    }

    public function create(): Response
    {
        $this->authorize("manage content items"); // Or specific 'create content items' permission
        return Inertia::render("Admin/ContentItems/Form", [
            "item" => null,
            "categories" => ContentCategory::orderByTranslatable("name")->get([
                "id",
                "name",
            ]),
            "featured_image_url" => null,
            "activeLanguages" => config("translatable.locales"),
        ]);
    }

    public function store(StoreContentItemRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();
        $validatedData["user_id"] = Auth::id();

        unset($validatedData["featured_image"]);

        $item = ContentItem::create($validatedData);

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

    public function show(ContentItem $content_item): RedirectResponse
    {
        // Changed from $contentItem to match route param
        // Changed from $contentItem to match route param
        $this->authorize("manage content items"); // Or 'view content items'
        return redirect()->route("admin.content-items.edit", $content_item);
    }

    public function edit(ContentItem $content_item): Response
    {
        $this->authorize("manage content items"); // Or 'update content items'
        $content_item->load("media", "category:id,name");

        return Inertia::render("Admin/ContentItems/Form", [
            "item" => $content_item->append([
                "original_featured_image_url",
                "thumbnail_featured_image_url",
            ]),
            "categories" => ContentCategory::orderByTranslatable("name")->get([
                "id",
                "name",
            ]),
            "featured_image_url" => $content_item->getFirstMediaUrl(
                "featured_image"
            ),
            // 'featured_image_thumb_url' => $content_item->getFirstMediaUrl('featured_image', 'thumbnail'), // Already in item via append
            "activeLanguages" => config("translatable.locales"), // <-- Pass this
        ]);
    }

    public function update(
        UpdateContentItemRequest $request,
        ContentItem $content_item
    ): RedirectResponse {
        $validatedData = $request->validated();
        unset($validatedData["featured_image"]);
        unset($validatedData["remove_featured_image"]);

        $content_item->update($validatedData);

        if ($request->boolean("remove_featured_image")) {
            $content_item->clearMediaCollection("featured_image");
        } elseif (
            $request->hasFile("featured_image") &&
            $request->file("featured_image")->isValid()
        ) {
            $content_item->clearMediaCollection("featured_image");
            $content_item
                ->addMediaFromRequest("featured_image")
                ->toMediaCollection("featured_image");
        }

        return redirect()
            ->route("admin.content-items.index")
            ->with("success", "Content item updated successfully.");
    }

    public function destroy(ContentItem $content_item): RedirectResponse
    {
        $this->authorize("manage content items"); // Or 'delete content items'
        $content_item->delete();
        return redirect()
            ->route("admin.content-items.index")
            ->with("success", "Content item deleted successfully.");
    }
}
