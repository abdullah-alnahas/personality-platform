<?php namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Cache; // Added Cache for clearing
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function edit(): Response
    {
        Gate::authorize("manage settings");

        // Fetch all settings, then group them by the 'group' attribute
        $allSettings = Setting::orderBy("group")->orderBy("key")->get();
        $groupedSettings = $allSettings->groupBy("group");

        // Prepare settings data for the view, ensuring all defined keys exist for form binding
        // and passing the full setting object for type information.
        $settingsData = $allSettings->keyBy("key")->map(function ($setting) {
            return $setting; // Pass the whole model
        });

        return Inertia::render("Admin/Settings/Edit", [
            "settings" => $settingsData, // All settings keyed by their key
            "groupedSettings" => $groupedSettings, // Settings grouped by their 'group'
            "activeLanguages" => config("translatable.locales"), // Pass available languages
        ]);
    }

    public function update(UpdateSettingsRequest $request): RedirectResponse
    {
        Gate::authorize("manage settings");

        $validatedData = $request->validated();
        $defaultLocale = config("app.locale", "en");

        foreach ($validatedData as $key => $valueFromRequest) {
            $setting = Setting::firstOrNew(["key" => $key]);

            // Prepare the value to be saved, applying sanitization if needed
            $valueToSave = $valueFromRequest;

            if ($setting->type === "richtext") {
                if (is_array($valueFromRequest)) {
                    $cleanedTranslations = [];
                    foreach ($valueFromRequest as $locale => $htmlContent) {
                        $cleanedTranslations[$locale] = is_string($htmlContent)
                            ? clean($htmlContent)
                            : $htmlContent;
                    }
                    $valueToSave = $cleanedTranslations;
                } elseif (is_string($valueFromRequest)) {
                    // Fallback if a non-array value is sent for a richtext field
                    $valueToSave = [$defaultLocale => clean($valueFromRequest)];
                }
            } elseif ($setting->type === "boolean") {
                // Ensure boolean is stored consistently (e.g., as a string '1' or '0' in default locale for JSON)
                // UpdateSettingsRequest already prepares boolean directly for $data array in frontend
                // The form now sends a direct boolean for 'boolean' types.
                // We need to store it in the expected JSON structure for translatable 'value' field.
                $valueToSave = [
                    $defaultLocale => $valueFromRequest ? "1" : "0",
                ];
            }
            // For other types like text, email, number, if they are translatable,
            // they are already expected as arrays from the form and UpdateSettingsRequest.

            // The Setting model uses HasTranslations for the 'value' attribute,
            // so assign the (potentially cleaned) array directly.
            $setting->value = $valueToSave;
            $setting->save();
        }

        // Clear relevant caches
        Cache::forget("site_settings_all");
        Cache::forget("active_social_accounts");
        Cache::forget("published_navigation_items_structured");
        // Specific setting caches (observers will also handle this, but belt-and-suspenders here is fine)
        if (isset($validatedData["about_page_content"])) {
            Cache::forget("setting_about_page_content");
        }
        if (isset($validatedData["site_name"])) {
            Cache::forget("setting_site_name");
        }

        return redirect()
            ->route("admin.settings.edit")
            ->with("success", "Settings updated successfully.");
    }
}
