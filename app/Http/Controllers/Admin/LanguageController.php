<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Http\Requests\Admin\StoreLanguageRequest;
use App\Http\Requests\Admin\UpdateLanguageRequest;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Config; // <-- Add this to load config

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
                "create_languages" => Gate::allows("manage languages"),
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
        $knownLanguages = Config::get("known_languages", []); // Load known languages from config

        return Inertia::render("Admin/Languages/Form", [
            "language" => null,
            "knownLanguages" => $knownLanguages, // <-- Pass to the view
        ]);
    }

    /**
     * Store a newly created language in storage.
     */
    public function store(StoreLanguageRequest $request): RedirectResponse
    {
        Language::create($request->validated());
        // Cache clearing is handled by the Language model's 'saving'/'deleted' events

        return redirect()
            ->route("admin.languages.index")
            ->with("success", "Language created successfully.");
    }

    /**
     * Show the form for editing the specified language.
     */
    public function edit(Language $language): InertiaResponse
    {
        Gate::authorize("manage languages");
        $knownLanguages = Config::get("known_languages", []); // Load known languages from config

        return Inertia::render("Admin/Languages/Form", [
            "language" => $language,
            "knownLanguages" => $knownLanguages, // <-- Pass to the view
        ]);
    }

    /**
     * Update the specified language in storage.
     */
    public function update(
        UpdateLanguageRequest $request,
        Language $language
    ): RedirectResponse {
        $language->update($request->validated());
        // Cache clearing is handled by the Language model's 'saving'/'deleted' events

        return redirect()
            ->route("admin.languages.index")
            ->with("success", "Language updated successfully.");
    }

    /**
     * Remove the specified language from storage.
     */
    public function destroy(Language $language): RedirectResponse
    {
        Gate::authorize("manage languages");

        // Prevent deletion of default or fallback locales
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

        $language->delete();
        // Cache clearing is handled by the Language model's 'saving'/'deleted' events

        return redirect()
            ->route("admin.languages.index")
            ->with("success", "Language deleted successfully.");
    }
}
