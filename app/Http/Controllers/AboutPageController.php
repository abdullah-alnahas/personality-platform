<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Setting;
use App\Services\BlockDataResolver;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;

class AboutPageController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * Checks for a page-builder page with slug 'about'. If found and published,
     * renders it through the unified PageDisplay component, making the about page
     * fully manageable from the admin page builder. Falls back to the legacy
     * static About view when no such page exists.
     */
    public function __invoke(Request $request): Response
    {
        $page = Cache::remember('about_page_builder', 3600, function () {
            return Page::where('slug', 'about')
                ->where('status', 'published')
                ->first();
        });

        if ($page) {
            $resolver = app(BlockDataResolver::class);
            $blocks = Cache::remember("about_page_blocks_{$page->id}", 3600, function () use ($page, $resolver) {
                return $page->blocks()
                    ->where('status', 'published')
                    ->orderBy('display_order')
                    ->get()
                    ->map(fn($block) => $resolver->resolve([
                        'id'            => $block->id,
                        'block_type'    => $block->block_type,
                        'content'       => $block->content,
                        'config'        => $block->config,
                        'display_order' => $block->display_order,
                        'status'        => $block->status,
                    ]))
                    ->all();
            });

            return Inertia::render('PageDisplay', [
                'page'   => [
                    'id'    => $page->id,
                    'title' => $page->getTranslations('title'),
                    'slug'  => $page->slug,
                    'layout' => $page->layout,
                    'meta_fields' => $page->meta_fields,
                ],
                'blocks' => $blocks,
                'settings' => $this->getSettings(),
            ]);
        }

        // Legacy fallback: render static about content from settings
        $aboutContent = Cache::remember('setting_about_page_content', 3600, function () {
            $setting = Setting::where('key', 'about_page_content')->first();
            return $setting?->value;
        });

        $siteName = Cache::remember('setting_site_name', 3600, function () {
            $setting = Setting::where('key', 'site_name')->first();
            return $setting?->value;
        });

        return Inertia::render('About', [
            'aboutContent' => $aboutContent,
            'siteName'     => $siteName,
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
