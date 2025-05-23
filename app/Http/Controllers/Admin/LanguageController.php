<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Language;
use App\Http\Requests\Admin\StoreLanguageRequest;
use App\Http\Requests\Admin\UpdateLanguageRequest;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;
// use Illuminate\Support\Facades\Cache; // No longer directly needed here
use Illuminate\Support\Facades\Gate;

class LanguageController extends Controller
{
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

    public function create(): InertiaResponse
    {
        Gate::authorize("manage languages");
        return Inertia::render("Admin/Languages/Form", [
            "language" => null,
        ]);
    }

    public function store(StoreLanguageRequest $request): RedirectResponse
    {
        // is_rtl is now inferred by the model's saving event
        Language::create($request->validated());
        // Cache::forget('available_locales'); // Handled by model observer
        // Cache::forget('translatable_locales_config'); // Handled by model observer

        return redirect()
            ->route("admin.languages.index")
            ->with("success", "Language created successfully.");
    }

    public function edit(Language $language): InertiaResponse
    {
        Gate::authorize("manage languages");
        return Inertia::render("Admin/Languages/Form", [
            "language" => $language,
        ]);
    }

    public function update(
        UpdateLanguageRequest $request,
        Language $language
    ): RedirectResponse {
        // is_rtl is now inferred by the model's saving event
        $language->update($request->validated());
        // Cache::forget('available_locales'); // Handled by model observer
        // Cache::forget('translatable_locales_config'); // Handled by model observer

        return redirect()
            ->route("admin.languages.index")
            ->with("success", "Language updated successfully.");
    }

    public function destroy(Language $language): RedirectResponse
    {
        Gate::authorize("manage languages");

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
        // Cache::forget('available_locales'); // Handled by model observer
        // Cache::forget('translatable_locales_config'); // Handled by model observer

        return redirect()
            ->route("admin.languages.index")
            ->with("success", "Language deleted successfully.");
    }
}
