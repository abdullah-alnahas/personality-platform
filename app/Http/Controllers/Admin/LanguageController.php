<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Http\Requests\Admin\StoreLanguageRequest;
use App\Http\Requests\Admin\UpdateLanguageRequest;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;

class LanguageController extends Controller
{
    /**
     * Display a listing of the languages.
     */
    public function index(): InertiaResponse
    {
        Gate::authorize("manage languages");
        $languages = Language::orderBy("name")->paginate(15)->withQueryString();
        return Inertia::render("Admin/Languages/Index", [
            "languages" => $languages,
            "can" => [
                "create_languages" => Gate::allows("manage languages"), // Simplified for now
                "edit_languages" => Gate::allows("manage languages"),
                "delete_languages" => Gate::allows("manage languages"),
            ],
        ]);
    }

    /**
     * Show the form for creating a new language.
     */
    public function create(): InertiaResponse
    {
        Gate::authorize("manage languages");
        return Inertia::render("Admin/Languages/Form", [
            "language" => null, // Indicate creating a new language
        ]);
    }

    /**
     * Store a newly created language in storage.
     */
    public function store(StoreLanguageRequest $request): RedirectResponse
    {
        Language::create($request->validated());
        Cache::forget("available_locales"); // Clear cache
        Cache::forget("translatable_locales_config"); // Clear cache for config if used

        return redirect()
            ->route("admin.languages.index")
            ->with("success", "Language created successfully.");
    }

    /**
     * Show the form for editing the specified language.
     * Note: Route model binding uses the primary key 'code'.
     */
    public function edit(Language $language): InertiaResponse
    {
        Gate::authorize("manage languages");
        return Inertia::render("Admin/Languages/Form", [
            "language" => $language,
        ]);
    }

    /**
     * Update the specified language in storage.
     * Note: Route model binding uses the primary key 'code'.
     */
    public function update(
        UpdateLanguageRequest $request,
        Language $language
    ): RedirectResponse {
        $language->update($request->validated());
        Cache::forget("available_locales"); // Clear cache
        Cache::forget("translatable_locales_config"); // Clear cache for config if used

        return redirect()
            ->route("admin.languages.index")
            ->with("success", "Language updated successfully.");
    }

    /**
     * Remove the specified language from storage.
     * Note: Route model binding uses the primary key 'code'.
     */
    public function destroy(Language $language): RedirectResponse
    {
        Gate::authorize("manage languages");

        // Prevent deletion of the default or fallback locale if critical
        if (
            in_array($language->code, [
                config("app.locale"),
                config("app.fallback_locale"),
            ])
        ) {
            return redirect()
                ->route("admin.languages.index")
                ->with("error", "Cannot delete default or fallback language.");
        }

        // Optional: Check if this language is being used in translatable content.
        // This could be complex to check across all translatable models.
        // For now, we'll allow deletion if not default/fallback.

        $language->delete();
        Cache::forget("available_locales"); // Clear cache
        Cache::forget("translatable_locales_config"); // Clear cache for config if used

        return redirect()
            ->route("admin.languages.index")
            ->with("success", "Language deleted successfully.");
    }
}
