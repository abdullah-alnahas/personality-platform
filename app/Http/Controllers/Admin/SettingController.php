<?php
// Edit file: app/Http/Controllers/Admin/SettingController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
// use Illuminate\Support\Facades\Cache; // If using caching for settings
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Show the form for editing site settings.
     */
    public function edit(): Response
    {
        Gate::authorize('manage settings'); // Check permission

        // Define the keys for the settings we want to edit
        // --- Added 'about_page_content' ---
        $settingKeys = ['site_name', 'about_page_content'];

        // Fetch settings, using the key as the collection key
        $settings = Setting::whereIn('key', $settingKeys)
            ->get()
            ->keyBy('key');

        // Prepare data for the view, ensuring defaults if settings don't exist
        $settingsData = [];
        foreach ($settingKeys as $key) {
            // Pass the whole setting model or null
            $settingsData[$key] = $settings->get($key);
        }

        // You might want to pass active languages for the form
        // $languages = Language::where('is_active', true)->get(['code', 'native_name']);

        return Inertia::render('Admin/Settings/Edit', [
            'settings' => $settingsData,
            // 'languages' => $languages,
        ]);
    }

    /**
     * Update the specified settings in storage.
     */
    public function update(UpdateSettingsRequest $request): RedirectResponse
    {
        Gate::authorize('manage settings'); // Handled by request, but good practice here too

        $validatedData = $request->validated();

        // Loop through validated data and update/create settings
        foreach ($validatedData as $key => $value) {
            // Use updateOrCreate based on the key
            $setting = Setting::firstOrNew(['key' => $key]);

            // Define which settings are translatable (could be moved to model or config)
            $translatableSettings = ['site_name', 'about_page_content'];

            // Handle translatable value if the input is an array AND the key is translatable
            if (is_array($value) && in_array($key, $translatableSettings)) {
                // Ensure setting model knows 'value' is translatable (already set in Setting model)
                $setting->setTranslations('value', $value);
            } else {
                // For non-translatable settings or simple values (if any)
                // We expect all settings here to be potentially translatable JSON
                // If a non-translatable setting existed, handle it here.
                // For safety, let's assume non-array values shouldn't override translatable JSON
                if (!is_array($value)) {
                    // Potentially log a warning or handle non-array non-translatable settings
                    // For now, we skip updating if it's not an expected array for a translatable field
                    // Or, if simple settings are added later:
                    // if (!in_array($key, $translatableSettings)) { $setting->value = $value; }
                    continue; // Skip if not an array for a translatable field
                } else if (!in_array($key, $translatableSettings)) {
                    // If it's an array but NOT meant to be translatable (e.g., multi-select value)
                    // You might store it as JSON directly, requires 'value' cast to 'array' or 'json'
                    // $setting->value = $value; // Make sure $casts handles this
                    continue; // Skip for now
                }
            }
            $setting->save();
        }

        // Clear settings cache if you are caching them
        // Cache::forget('site_settings'); // Example cache key

        return redirect()->route('admin.settings.edit')
            ->with('success', 'Settings updated successfully.');
    }
}
