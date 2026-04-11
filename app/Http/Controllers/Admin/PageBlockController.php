<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePageBlockRequest;
use App\Http\Requests\Admin\UpdatePageBlockRequest;
use App\Models\ContentCategory;
use App\Models\Page;
use App\Models\PageBlock;
use App\Models\Quote;
use App\Services\BlockRegistry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PageBlockController extends Controller
{
    public function create(Page $page): InertiaResponse
    {
        Gate::authorize('manage pages');

        $maxOrder = $page->blocks()->max('display_order') ?? -1;

        return Inertia::render('Admin/PageBlocks/Form', [
            'page' => [
                'id' => $page->id,
                'title' => $page->getTranslations('title'),
                'slug' => $page->slug,
            ],
            'block' => null,
            'blockTypes' => BlockRegistry::all(),
            'blockTypeLabels' => BlockRegistry::labels(),
            'activeLanguages' => config('translatable.locales'),
            'categories' => ContentCategory::published()
                ->orderByTranslatable('name')
                ->get(['id', 'name']),
            'quotes' => Quote::published()->get(['id', 'text', 'source']),
            'nextOrder' => $maxOrder + 1,
        ]);
    }

    public function store(StorePageBlockRequest $request, Page $page): RedirectResponse
    {
        $data = $request->validated();
        $data['page_id'] = $page->id;

        // Merge default config with provided config
        $blockType = $data['block_type'];
        $defaultConfig = BlockRegistry::defaultConfig($blockType);
        $data['config'] = array_merge($defaultConfig, $data['config'] ?? []);

        $page->blocks()->create($data);

        return redirect()
            ->route('admin.pages.edit', $page)
            ->with('success', __('Block added successfully.'));
    }

    public function edit(Page $page, PageBlock $block): InertiaResponse
    {
        Gate::authorize('manage pages');
        abort_if($block->page_id !== $page->id, 404);

        return Inertia::render('Admin/PageBlocks/Form', [
            'page' => [
                'id' => $page->id,
                'title' => $page->getTranslations('title'),
                'slug' => $page->slug,
            ],
            'block' => [
                'id' => $block->id,
                'block_type' => $block->block_type,
                'content' => $block->content,
                'display_order' => $block->display_order,
                'status' => $block->status,
                'config' => $block->config,
            ],
            'blockTypes' => BlockRegistry::all(),
            'blockTypeLabels' => BlockRegistry::labels(),
            'activeLanguages' => config('translatable.locales'),
            'categories' => ContentCategory::published()
                ->orderByTranslatable('name')
                ->get(['id', 'name']),
            'quotes' => Quote::published()->get(['id', 'text', 'source']),
            'nextOrder' => $block->display_order,
        ]);
    }

    public function update(UpdatePageBlockRequest $request, Page $page, PageBlock $block): RedirectResponse
    {
        Gate::authorize('manage pages');
        abort_if($block->page_id !== $page->id, 404);
        $data = $request->validated();

        // Merge default config with provided config
        $blockType = $data['block_type'];
        $defaultConfig = BlockRegistry::defaultConfig($blockType);
        $data['config'] = array_merge($defaultConfig, $data['config'] ?? []);

        $block->update($data);

        return redirect()
            ->route('admin.pages.edit', $page)
            ->with('success', __('Block updated successfully.'));
    }

    public function destroy(Page $page, PageBlock $block): RedirectResponse
    {
        Gate::authorize('manage pages');
        abort_if($block->page_id !== $page->id, 404);
        $block->delete();

        return redirect()
            ->route('admin.pages.edit', $page)
            ->with('success', __('Block deleted successfully.'));
    }

    public function reorder(Request $request, Page $page): JsonResponse
    {
        Gate::authorize('manage pages');

        $request->validate([
            'blocks' => 'required|array',
            'blocks.*.id' => 'required|integer|exists:page_blocks,id',
            'blocks.*.display_order' => 'required|integer|min:0',
        ]);

        foreach ($request->input('blocks') as $blockData) {
            PageBlock::where('id', $blockData['id'])
                ->where('page_id', $page->id)
                ->update(['display_order' => $blockData['display_order']]);
        }

        return response()->json(['message' => 'Blocks reordered successfully.']);
    }
}
