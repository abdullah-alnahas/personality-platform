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
                $sectionData = $section->toArray(); // Convert model attributes to array
                $sectionData['items'] = []; // Initialize items array

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
                            // Pass only specific fields needed by the frontend
                            $sectionData['quote_data'] = [
                                'text' => $quote->getTranslations('text'),
                                'source' => $quote->getTranslations('source'),
                            ];
                        }
                        break;
                    case 'social_media_links':
                        // No specific items needed here, section data (title) is sufficient.
                        // Frontend will use globally shared social accounts.
                        break;
                     case 'vision':
                         // No specific items needed here, section data (title, subtitle, config) is sufficient.
                         break;
                    // Add other cases as needed
                }
                $processedSections[] = $sectionData;
            }
            return $processedSections;
        });

        // Generic featured items (Can be kept or removed depending on whether homepage sections cover all needs)
        $genericFeaturedItems = ContentItem::published()
            ->where('is_featured_home', true)
            ->with(['media', 'category:id,name,slug'])
            ->latest('publish_date')
            ->take(3) // Example limit
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
            'genericFeaturedItems' => $genericFeaturedItems, // Keep or remove as needed
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }
}
