<?php
// Edit file: app/Http/Controllers/Admin/ContentItemController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentItem;
use App\Models\ContentCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Admin\StoreContentItemRequest;
use App\Http\Requests\Admin\UpdateContentItemRequest;
// use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ContentItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        if (!Auth::user()->can('manage content items')) { abort(403); }
        $this->authorize('viewAny', ContentItem::class);
        // Authorization TODO
        $items = ContentItem::with([
                'category:id,name', // Select only necessary columns
                'author:id,name',
                'media' => fn ($query) => $query->where('collection_name', 'featured_image') // Eager load only featured image media
            ])
            ->latest('publish_date')
            ->paginate(15)
            ->withQueryString();

        // Add image URL to each item for easier frontend display
        $items->through(fn ($item) => [
            'id' => $item->id,
            'title' => $item->getTranslations('title'), // Get all translations
            'slug' => $item->slug,
            'status' => $item->status,
            'publish_date' => $item->publish_date?->toDateString(), // Format date
            'category_name' => $item->category?->getTranslation('name', config('app.locale', 'en')), // Get translated category name
            'author_name' => $item->author?->name,
            'featured_image_thumb_url' => $item->getFirstMediaUrl('featured_image', 'thumbnail'), // Add thumbnail URL (needs conversion defined) - Placeholder for now
            'featured_image_url' => $item->getFirstMediaUrl('featured_image'), // Add original URL
            'created_at' => $item->created_at->toDateTimeString(), // Format date
            'updated_at' => $item->updated_at->toDateTimeString(), // Format date

        ]);


        return Inertia::render('Admin/ContentItems/Index', [
            'items' => $items,
            'can' => [ // TODO: Permissions
                'create_item' => true,
                'edit_item' => true,
                'delete_item' => true,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        if (!Auth::user()->can('manage content items')) { abort(403); }
        $this->authorize('create', ContentItem::class); // Requires a Policy or Gate definition

        return Inertia::render('Admin/ContentItems/Form', [
            'item' => null,
            'categories' => ContentCategory::orderBy('name->en')->get(['id', 'name']),
            'featured_image_url' => null, // No image yet for create form
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContentItemRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();
        $validatedData['user_id'] = Auth::id();

        // Remove file data before creating model if it exists
        unset($validatedData['featured_image']);

        $item = ContentItem::create($validatedData);

        // Handle featured image upload IF a file was submitted
        if ($request->hasFile('featured_image') && $request->file('featured_image')->isValid()) {
            $item->addMediaFromRequest('featured_image')->toMediaCollection('featured_image');
        }

        return redirect()->route('admin.content-items.index')
                         ->with('success', 'Content item created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ContentItem $contentItem)
    {
         // Authorization check
         if (!Auth::user()->can('manage content items')) { abort(403); }
         $this->authorize('view', $contentItem); // Requires a Policy
         return redirect()->route('admin.content-items.edit', $contentItem);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ContentItem $content_item): Response
    {
        // Authorization TODO
        if (!Auth::user()->can('manage content items')) { abort(403); }
        $this->authorize('update', $content_item); // Requires a Policy

        // Eager load necessary relations and media
        $content_item->load('media', 'category:id,name');

        return Inertia::render('Admin/ContentItems/Form', [
            // Pass the entire item, including loaded media relation
            'item' => $content_item->append(['original_featured_image_url', 'thumbnail_featured_image_url']), // Add accessors if needed
            'categories' => ContentCategory::orderBy('name->en')->get(['id', 'name']),
             // Pass the specific URL for convenience in the form
            'featured_image_url' => $content_item->getFirstMediaUrl('featured_image'),
            'featured_image_thumb_url' => $content_item->getFirstMediaUrl('featured_image', 'thumbnail'), // Placeholder for thumbnail conversion
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContentItemRequest $request, ContentItem $content_item): RedirectResponse
    {
        $validatedData = $request->validated();

        // Remove file/image related fields before updating model attributes
        unset($validatedData['featured_image']);
        unset($validatedData['remove_featured_image']);

        $content_item->update($validatedData);

        // Handle featured image update/removal
        if ($request->boolean('remove_featured_image')) {
            // If remove flag is set, clear the collection
            $content_item->clearMediaCollection('featured_image');
        } elseif ($request->hasFile('featured_image') && $request->file('featured_image')->isValid()) {
             // If a new file is uploaded, replace the existing one
             // clearMediaCollection is often needed for single file collections before adding new
            $content_item->clearMediaCollection('featured_image');
            $content_item->addMediaFromRequest('featured_image')->toMediaCollection('featured_image');
        }
        // If neither remove flag is set nor a new file is uploaded, do nothing to the image.

        return redirect()->route('admin.content-items.index')
                         ->with('success', 'Content item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContentItem $content_item): RedirectResponse
    {
        // Authorization TODO
        if (!Auth::user()->can('manage content items')) { abort(403); }
        $this->authorize('update', $content_item); // Requires a Policy

        // Optionally delete associated media when soft deleting the item
        // Consider if this is the desired behavior. Might be better to prune old media periodically.
        // $content_item->clearMediaCollection('featured_image');

        $content_item->delete(); // Soft delete

        return redirect()->route('admin.content-items.index')
                         ->with('success', 'Content item deleted successfully.');
    }
}