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
        $translatableSettingsConfig = config(
            "translatable.setting_attributes",
            ["value"]
        ); // Default to 'value'

        foreach ($validatedData as $key => $value) {
            $setting = Setting::firstOrNew(["key" => $key]);

            // Determine if the current setting key is configured to be translatable
            // For simplicity, we assume all settings store their main data in the 'value' field.
            // If other fields were translatable, this logic would need to be more complex.
            $isTranslatableValue = true; // By default, assume 'value' field is always translatable for settings

            if ($isTranslatableValue && is_array($value)) {
                // If the value from the form is an array, set translations for the 'value' attribute
                $setting->setTranslations("value", $value);
            } elseif (!$isTranslatableValue && !is_array($value)) {
                // If not translatable and not an array, set directly (assuming it's a simple string/number)
                // This case assumes single-language non-JSON values might also be stored in value['en'] by form.
                // Or, if your form sends non-translatable values directly:
                // $setting->value = ['en' => $value]; // Store as array for consistency if 'value' cast to array
                $setting->value = $value; // If 'value' is NOT cast to array and is simple string
            } else {
                // If it's a simple value for a translatable field, wrap it for the default locale
                // This handles cases like a non-translatable boolean or number being sent for a 'value' field.
                // We wrap in default locale to maintain structure if 'value' is JSON.
                // However, the seeder and form should ideally send structured data.
                // For boolean or number from switch/number input not wrapped in lang array:
                if (
                    is_bool($value) ||
                    is_numeric($value) ||
                    is_string($value)
                ) {
                    // For non-translatable types like boolean/number, we store it simply.
                    // The Setting model's $casts should handle 'value' as 'array' if it's always JSON.
                    // If value is not meant to be an array (e.g. a simple string '12' for posts_per_page)
                    // this needs careful handling based on how $casts['value'] is defined.
                    // Assuming 'value' is always JSON/array in DB due to HasTranslations.
                    $defaultLocale = config("app.locale");
                    $setting->value = [$defaultLocale => $value];
                }
            }
            $setting->save();
        }

        Cache::forget("site_settings_all"); // Clear general settings cache used by HomepageController
        Cache::forget("active_social_accounts"); // Clear social accounts cache from HandleInertiaRequests
        Cache::forget("published_navigation_items_structured"); // Clear navigation cache

        return redirect()
            ->route("admin.settings.edit")
            ->with("success", "Settings updated successfully.");
    }
}
