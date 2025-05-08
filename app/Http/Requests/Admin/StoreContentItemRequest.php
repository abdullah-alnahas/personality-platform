<?php
// Edit file: app/Http/Requests/Admin/StoreContentItemRequest.php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule; // Import Rule for 'in' validation
// use Illuminate\Support\Facades\Gate; // Optional for Policy-based authorization

class StoreContentItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Check if the user has the permission to manage content items
        // Replace with a more specific permission like 'create content items' if defined
        return $this->user()->can('manage content items');

        // Example using Policy (if you create a ContentItemPolicy later):
        // return Gate::allows('create', \App\Models\ContentItem::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'                 => ['required', 'array'],
            // Ensure at least one language title is provided
            'title.*'               => ['required_without_all:'.implode(',', $this->getOtherLanguageKeys('title')), 'nullable', 'string', 'max:255'],

            'content_category_id'   => ['required', 'integer', 'exists:content_categories,id'],

            'content'               => ['nullable', 'array'],
            'content.*'             => ['nullable', 'string'], // Consider max length if needed

            'excerpt'               => ['nullable', 'array'],
            'excerpt.*'             => ['nullable', 'string', 'max:500'], // Example max length

            'status'                => ['required', 'string', Rule::in(['published', 'draft', 'pending'])],
            'publish_date'          => ['nullable', 'date'],
            'is_featured_home'      => ['sometimes', 'boolean'], // Handles true/false/1/0/'1'/'0'/null

            // Add validation for the featured image (used in Task 3)
            'featured_image'        => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'], // 2MB Max

            // Potential future meta fields validation
            // 'meta_fields'           => ['nullable', 'array'],
            // 'meta_fields.*.title'   => ['nullable', 'string', 'max:255'],
            // 'meta_fields.*.description' => ['nullable', 'string', 'max:160'],
        ];
    }

    /**
     * Prepare the data for validation.
     * Convert checkbox value ('on' or null) to boolean.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_featured_home' => $this->boolean('is_featured_home'),
        ]);
    }

    /**
    * Helper to get keys for other languages for required_without_all rule.
    * TODO: Refactor this to use dynamically fetched active languages later.
    */
    protected function getOtherLanguageKeys(string $field): array
    {
        $keys = [];
        // Assuming active languages are available (e.g., from config or DB)
        // Replace with actual logic to get active language codes
        $activeLanguages = ['en', 'ar', 'tr']; // Example - Fetch dynamically later
        foreach ($activeLanguages as $langCode) {
             $keys[] = $field . '.' . $langCode;
        }
        // Filter out the current language being validated if necessary,
        // but required_without_all handles this implicitly.
        return $keys;
    }
}
