<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePageRequest;
use App\Http\Requests\Admin\UpdatePageRequest;
use App\Models\Page;
use App\Services\BlockRegistry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PageController extends Controller
{
    public function index(): InertiaResponse
    {
        Gate::authorize('manage pages');

        $pages = Page::withCount('blocks')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $pages = $pages->through(fn(Page $page) => [
            'id' => $page->id,
            'title' => $page->getTranslations('title'),
            'slug' => $page->slug,
            'status' => $page->status,
            'is_homepage' => $page->is_homepage,
            'layout' => $page->layout,
            'blocks_count' => $page->blocks_count,
            'updated_at' => $page->updated_at->toDateTimeString(),
        ]);

        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
        ]);
    }

    public function create(): InertiaResponse
    {
        Gate::authorize('manage pages');

        return Inertia::render('Admin/Pages/Form', [
            'page' => null,
            'activeLanguages' => config('translatable.locales'),
        ]);
    }

    public function store(StorePageRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $page = Page::create($data);

        return redirect()
            ->route('admin.pages.edit', $page)
            ->with('success', 'Page created. Now add blocks to build the layout.');
    }

    public function edit(Page $page): InertiaResponse
    {
        Gate::authorize('manage pages');

        $page->load(['blocks' => fn($q) => $q->orderBy('display_order')]);

        return Inertia::render('Admin/Pages/Form', [
            'page' => [
                'id' => $page->id,
                'title' => $page->getTranslations('title'),
                'slug' => $page->slug,
                'status' => $page->status,
                'is_homepage' => $page->is_homepage,
                'layout' => $page->layout,
                'meta_fields' => $page->meta_fields,
                'blocks' => $page->blocks->map(fn($block) => [
                    'id' => $block->id,
                    'block_type' => $block->block_type,
                    'content' => $block->content,
                    'display_order' => $block->display_order,
                    'status' => $block->status,
                    'config' => $block->config,
                ]),
            ],
            'activeLanguages' => config('translatable.locales'),
            'blockTypes' => BlockRegistry::all(),
            'blockTypeLabels' => BlockRegistry::labels(),
        ]);
    }

    public function update(UpdatePageRequest $request, Page $page): RedirectResponse
    {
        Gate::authorize('manage pages');
        $page->update($request->validated());

        return redirect()
            ->route('admin.pages.edit', $page)
            ->with('success', 'Page updated successfully.');
    }

    public function destroy(Page $page): RedirectResponse
    {
        Gate::authorize('manage pages');
        $page->delete();

        return redirect()
            ->route('admin.pages.index')
            ->with('success', 'Page deleted successfully.');
    }
}
