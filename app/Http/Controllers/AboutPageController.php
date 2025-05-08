<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;

class AboutPageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): Response
    {
        // Fetch the about page content setting
        // Cache it for a reasonable duration (e.g., 1 hour)
        $aboutContentSetting = Cache::remember('setting_about_page_content', 3600, function () {
            return Setting::where('key', 'about_page_content')->first();
        });

        // Prepare the content for the view (pass the value array or null)
        $aboutContent = $aboutContentSetting ? $aboutContentSetting->value : null;

        // Fetch site name for the title (optional, could rely on layout)
        $siteNameSetting = Cache::remember('setting_site_name', 3600, function () {
            return Setting::where('key', 'site_name')->first();
        });
        $siteName = $siteNameSetting?->value ?? null;


        return Inertia::render('About', [
            'aboutContent' => $aboutContent, // Pass the translatable content array
            'siteName' => $siteName, // Pass site name for potential use in Head title
        ]);
    }
}
