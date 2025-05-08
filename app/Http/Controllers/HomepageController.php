<?php

namespace App\Http\Controllers;

use App\Models\ContentItem;
use App\Models\Quote;
use App\Models\Setting;
use App\Models\SocialAccount;
use App\Models\HomepageSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route; // <-- Import Route Facade
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;

class HomepageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        $settings = Cache::remember('site_settings_all', 3600, function () {
            return Setting::all()->keyBy('key');
        });

        $homepageSectionsData = Cache::remember('homepage_sections_data', 3600, function () {
            $sections = HomepageSection::published()->orderBy('display_order')->get();
            $processedSections = [];

            foreach ($sections as $section) {
                $sectionData = $section->toArray();
                $sectionData['items'] = [];

                switch ($section->section_type) {
                    case 'thematic_carousel':
                        if ($section->content_category_id) {
                            $sectionData['items'] = ContentItem::published()
                                ->where('content_category_id', $section->content_category_id)
                                ->with(['media', 'category:id,name,slug'])
                                ->latest('publish_date')
                                ->take($section->max_items ?: 6)
                                ->get()
                                ->map(fn ($item) => [
                                    'id' => $item->id,
                                    'title' => $item->getTranslations('title'),
                                    'excerpt' => $item->getTranslations('excerpt'),
                                    'slug' => $item->slug,
                                    'category_slug' => $item->category?->slug,
                                    'category_name' => $item->category?->getTranslations('name'),
                                    'image_url' => $item->getFirstMediaUrl('featured_image', 'thumbnail'),
                                ])->all();
                        }
                        break;
                    case 'latest_news':
                        $sectionData['items'] = ContentItem::published()
                            ->with(['category:id,name,slug'])
                            ->latest('publish_date')
                            ->take($section->max_items ?: 6)
                            ->get()
                            ->map(fn ($item) => [
                                'id' => $item->id,
                                'title' => $item->getTranslations('title'),
                                'slug' => $item->slug,
                                'category_slug' => $item->category?->slug,
                                'category_name' => $item->category?->getTranslations('name'),
                                'publish_date_formatted' => $item->publish_date?->isoFormat('LL'),
                            ])->all();
                        break;
                    case 'featured_quote':
                        // Fetching the quote here and adding it to the section data
                        $quote = Quote::published()->inRandomOrder()->first();
                        if ($quote) {
                            $sectionData['quote_data'] = $quote->only(['text', 'source']);
                        }
                        break;
                    // Add other cases as needed
                }
                $processedSections[] = $sectionData;
            }
            return $processedSections;
        });

        // Generic featured items (can be removed if not needed alongside dynamic sections)
        $genericFeaturedItems = ContentItem::published()
            ->where('is_featured_home', true)
            ->with(['media', 'category:id,name,slug'])
            ->latest('publish_date')
            ->take(3)
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'title' => $item->getTranslations('title'),
                'excerpt' => $item->getTranslations('excerpt'),
                'slug' => $item->slug,
                'category_slug' => $item->category?->slug,
                'category_name' => $item->category?->getTranslations('name'),
                'image_url' => $item->getFirstMediaUrl('featured_image', 'thumbnail'),
            ]);


        return Inertia::render('Welcome', [
            'settings' => $settings,
            'homepageSections' => $homepageSectionsData,
            'genericFeaturedItems' => $genericFeaturedItems,
            // Pass canLogin/canRegister based on actual route existence
            'canLogin' => Route::has('login'), // Use the imported Facade
            'canRegister' => Route::has('register'), // Use the imported Facade
        ]);
    }
}
