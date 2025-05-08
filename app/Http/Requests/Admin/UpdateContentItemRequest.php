<?php
// Edit file: app/Http/Requests/Admin/UpdateContentItemRequest.php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
// use Illuminate\Support\Facades\Gate;

class UpdateContentItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
         // Check if the user has the permission to manage content items
         // Replace with a more specific permission like 'update content items' if defined
        return $this->user()->can('manage content items');

        // Example using Policy (if you create a ContentItemPolicy later):
        // $contentItem = $this->route('content_item'); // Get the item from the route
        // return Gate::allows('update', $contentItem);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
         // Usually similar to store, but potentially use 'sometimes' if a field
         // doesn't *have* to be present in the update request payload.
         // Slugs are typically handled automatically by the sluggable package.
        return [
            'title'                 => ['sometimes', 'required', 'array'], // 'sometimes' means only validate if present
            'title.*'               => ['required_without_all:'.implode(',', $this->getOtherLanguageKeys('title')), 'nullable', 'string', 'max:255'],

            'content_category_id'   => ['sometimes', 'required', 'integer', 'exists:content_categories,id'],

            'content'               => ['nullable', 'array'], // Often nullable on update
            'content.*'             => ['nullable', 'string'],

            'excerpt'               => ['nullable', 'array'],
            'excerpt.*'             => ['nullable', 'string', 'max:500'],

            'status'                => ['sometimes', 'required', 'string', Rule::in(['published', 'draft', 'pending'])],
            'publish_date'          => ['nullable', 'date'],
            'is_featured_home'      => ['sometimes', 'boolean'],

            // Add validation for updating/removing the featured image (used in Task 3)
            'featured_image'        => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'], // Validate if new image uploaded
            'remove_featured_image' => ['nullable', 'boolean'], // Add a field to signal removal
        ];
        // Note: Slug validation might be added here if manual slug editing is allowed.
        // 'slug' => ['sometimes', 'required', 'string', 'alpha_dash', Rule::unique('content_items')->ignore($this->route('content_item')->id)],
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_featured_home' => $this->boolean('is_featured_home'),
            'remove_featured_image' => $this->boolean('remove_featured_image'), // Ensure boolean
        ]);
    }

     /**
     * Helper to get keys for other languages for required_without_all rule.
     * TODO: Refactor this to use dynamically fetched active languages later.
     */
    protected function getOtherLanguageKeys(string $field): array
    {
        $keys = [];
        $activeLanguages = ['en', 'ar', 'tr']; // Example - Fetch dynamically later
        foreach ($activeLanguages as $langCode) {
             $keys[] = $field . '.' . $langCode;
        }
        return $keys;
    }
}
