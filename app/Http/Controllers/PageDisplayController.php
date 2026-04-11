<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Setting;
use App\Services\BlockDataResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class PageDisplayController extends Controller
{
    protected BlockDataResolver $resolver;

    public function __construct(BlockDataResolver $resolver)
    {
        $this->resolver = $resolver;
    }

    public function homepage(Request $request): Response
    {
        $page = Cache::remember('homepage_data', 3600, function () {
            return Page::published()
                ->homepage()
                ->with(['publishedBlocks'])
                ->first();
        });

        if (!$page) {
            // Fallback: render empty page
            return Inertia::render('PageDisplay', [
                'page' => null,
                'blocks' => [],
                'settings' => $this->getSettings(),
            ]);
        }

        return $this->renderPage($page);
    }

    public function show(string $slug): Response
    {
        $page = Cache::remember("page_data_{$slug}", 3600, function () use ($slug) {
            return Page::published()
                ->where('slug', $slug)
                ->with(['publishedBlocks'])
                ->first();
        });

        if (!$page) {
            abort(404);
        }

        return $this->renderPage($page);
    }

    protected function renderPage(Page $page): Response
    {
        $blocks = $page->publishedBlocks
            ->map(fn($block) => [
                'id' => $block->id,
                'block_type' => $block->block_type,
                'content' => $block->content,
                'config' => $block->config,
                'display_order' => $block->display_order,
            ])
            ->map(fn($block) => $this->resolver->resolve($block))
            ->values()
            ->all();

        return Inertia::render('PageDisplay', [
            'page' => [
                'id' => $page->id,
                'title' => $page->getTranslations('title'),
                'slug' => $page->slug,
                'layout' => $page->layout,
                'meta_fields' => $page->meta_fields,
            ],
            'blocks' => $blocks,
            'settings' => $this->getSettings(),
        ]);
    }

    protected function getSettings(): mixed
    {
        return Cache::remember('site_settings_all', 3600, function () {
            return Setting::all()->keyBy('key')->map(function ($setting) {
                return [
                    'value' => $setting->value,
                    'type'  => $setting->type,
                ];
            });
        });
    }
}
