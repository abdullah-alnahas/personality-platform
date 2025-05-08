<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
// use Illuminate\Support\Facades\Gate;

class UpdateContentCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Get the category instance from the route
        $category = $this->route('content_category'); // Parameter name matches route definition

        // Example using direct permission check:
        return $this->user()->can('manage categories');

        // Example using Policy (preferred for resource updates):
        // return Gate::allows('update', $category);

        // Or simply return true if authorization is handled elsewhere
        // return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
         // Rules are similar to store, but 'required' might change to 'sometimes' if needed,
         // though usually you still want to update required fields.
        return [
            'name' => ['sometimes', 'required', 'array'], // `sometimes` means only validate if present
            'name.*' => ['required_without_all:'.implode(',', $this->getOtherLanguageKeys('name')), 'nullable', 'string', 'max:255'],

            'description' => ['nullable', 'array'],
            'description.*' => ['nullable', 'string'],

            'quote' => ['nullable', 'array'],
            'quote.*' => ['nullable', 'string'],

            'meta_fields' => ['nullable', 'array'],
            'meta_fields.*' => ['nullable', 'array'],
            'meta_fields.*.*' => ['nullable', 'string'],

            'icon' => ['nullable', 'string', 'max:100'],
            'order' => ['nullable', 'integer', 'min:0'],
            'status' => ['sometimes','required', 'string', Rule::in(['published', 'draft'])],
        ];
        // Note: Slug validation is usually handled automatically by spatie/laravel-sluggable
        // based on its configuration (e.g., doNotGenerateSlugsOnUpdate).
        // If manual slug editing is allowed, add validation here:
        // 'slug' => ['sometimes', 'required', 'string', 'alpha_dash', Rule::unique('content_categories')->ignore($this->route('content_category')->id)],
    }

     /**
     * Helper to get keys for other languages for required_without_all rule.
     */
    protected function getOtherLanguageKeys(string $field): array
    {
        $keys = [];
        // Replace with actual logic to get active language codes
        $activeLanguages = ['en', 'ar', 'tr']; // Example
        foreach ($activeLanguages as $langCode) {
             $keys[] = $field . '.' . $langCode;
        }
        return $keys;
    }
}
