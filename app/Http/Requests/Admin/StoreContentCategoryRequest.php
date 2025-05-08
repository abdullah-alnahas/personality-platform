<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
// use Illuminate\Support\Facades\Gate;

class StoreContentCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Example using direct permission check:
        return $this->user()->can('manage categories');

        // Example using Policy:
        // return Gate::allows('create', \App\Models\ContentCategory::class);

        // Or simply return true if authorization is handled elsewhere (e.g., middleware)
        // return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Basic rules - assumes frontend sends translatable fields as objects/arrays
        // e.g., name: { en: 'English Name', ar: 'Arabic Name' }
        // Adjust based on how your frontend form handles translations
        return [
            'name' => ['required', 'array'],
            // Validate at least one language has a name provided
            'name.*' => ['required_without_all:'.implode(',', $this->getOtherLanguageKeys('name')), 'nullable', 'string', 'max:255'],

            'description' => ['nullable', 'array'],
            'description.*' => ['nullable', 'string'], // Add max length if needed

            'quote' => ['nullable', 'array'],
            'quote.*' => ['nullable', 'string'],

            'meta_fields' => ['nullable', 'array'], // For SEO etc.
            'meta_fields.*' => ['nullable', 'array'], // Assumes meta fields are nested {en: {title: '...', desc: '...'}, ...}
            'meta_fields.*.*' => ['nullable', 'string'], // Validate nested meta strings

            'icon' => ['nullable', 'string', 'max:100'],
            // 'image' => ['nullable', 'image', 'max:2048'], // Add later with MediaLibrary handling
            'order' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'string', Rule::in(['published', 'draft'])],
        ];
    }

     /**
     * Helper to get keys for other languages for required_without_all rule.
     */
    protected function getOtherLanguageKeys(string $field): array
    {
        $keys = [];
        // Assuming active languages are available (e.g., from config or DB)
        // Replace with actual logic to get active language codes
        $activeLanguages = ['en', 'ar', 'tr']; // Example
        foreach ($activeLanguages as $langCode) {
             $keys[] = $field . '.' . $langCode;
        }
        // Filter out the current language being validated if necessary,
        // but required_without_all handles this implicitly.
        return $keys;
    }
}
