<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreContentCategoryRequest;
use App\Http\Requests\Admin\UpdateContentCategoryRequest;
use App\Models\ContentCategory;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ContentCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        Gate::authorize('manage categories');

        $categories = ContentCategory::latest()->paginate(15)->withQueryString();

        $canManage = auth()->user()->can('manage categories');

        return Inertia::render('Admin/ContentCategories/Index', [
            'categories' => $categories,
            'can' => [
                'create' => $canManage,
                'edit'   => $canManage,
                'delete' => $canManage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        Gate::authorize('manage categories');

        $pages = Page::orderBy('id')->get(['id', 'title', 'slug']);

        return Inertia::render('Admin/ContentCategories/Form', [
            'category' => null,
            'pages'    => $pages->map(fn($p) => [
                'id'    => $p->id,
                'title' => $p->getTranslations('title'),
                'slug'  => $p->slug,
            ]),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContentCategoryRequest $request): RedirectResponse
    {
        // Authorization handled by StoreContentCategoryRequest

        ContentCategory::create($request->validated());

        return redirect()->route('admin.content-categories.index')
                         ->with('success', 'Category created successfully.');
    }

    /**
     * Display the specified resource. (Usually not needed for Admin CRUD)
     */
    // public function show(ContentCategory $contentCategory)
    // {
    //     //
    // }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ContentCategory $content_category): Response
    {
        Gate::authorize('manage categories');

        $pages = Page::orderBy('id')->get(['id', 'title', 'slug']);

        return Inertia::render('Admin/ContentCategories/Form', [
            'category' => $content_category,
            'pages'    => $pages->map(fn($p) => [
                'id'    => $p->id,
                'title' => $p->getTranslations('title'),
                'slug'  => $p->slug,
            ]),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContentCategoryRequest $request, ContentCategory $content_category): RedirectResponse
    {
         // Authorization handled by UpdateContentCategoryRequest (implicitly checks 'update' permission)

        $content_category->update($request->validated());

        return redirect()->route('admin.content-categories.index')
                         ->with('success', 'Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ContentCategory $content_category): RedirectResponse
    {
        Gate::authorize('manage categories');

        if ($content_category->contentItems()->exists()) {
            return redirect()->route('admin.content-categories.index')
                ->with('error', 'Cannot delete this category: it still has content items. Reassign or delete the items first.');
        }

        $content_category->delete();

        return redirect()->route('admin.content-categories.index')
                         ->with('success', 'Category deleted successfully.');
    }
}
