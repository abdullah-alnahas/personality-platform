<?php
// Edit file: app/Http/Requests/Admin/UpdateSettingsRequest.php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
// use Illuminate\Support\Facades\Gate;

class UpdateSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Check if user has permission to manage settings
        return $this->user()->can('manage settings');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Define validation rules for each setting key you expect from the form
        return [
            // Example for a translatable site_name setting
            'site_name' => ['required', 'array'],
            'site_name.*' => ['required_without_all:' . implode(',', $this->getOtherLanguageKeys('site_name')), 'nullable', 'string', 'max:255'],

            // --- Add rules for About Page Content ---
            'about_page_content' => ['nullable', 'array'], // It's okay if it's not sent or empty
            'about_page_content.*' => ['nullable', 'string'], // Validate content for each language is a string

            // Add rules for other settings here, e.g.:
            // 'contact_email' => ['nullable', 'email', 'max:255'],
            // 'posts_per_page' => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * Helper to get keys for other languages for required_without_all rule.
     */
    protected function getOtherLanguageKeys(string $field): array
    {
        $keys = [];
        // Replace with actual logic to get active language codes later
        $activeLanguages = config('translatable.locales', ['en']); // Use config or query Language model
        foreach ($activeLanguages as $langCode) {
            $keys[] = $field . '.' . $langCode;
        }
        return $keys;
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'site_name.*' => 'site name',
            'about_page_content.*' => 'about page content', // Nicer error message
        ];
    }
}
