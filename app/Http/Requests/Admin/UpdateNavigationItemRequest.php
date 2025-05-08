<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateNavigationItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Although the route has middleware, checking here is good practice
        return $this->user()->can('manage navigation');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
         // Usually similar to store, potentially using 'sometimes'
        return [
            'menu_location' => ['sometimes', 'required', 'string', 'max:100'],
            'label' => ['sometimes', 'required', 'array'],
            'label.*' => ['required_without_all:'.implode(',', $this->getOtherLanguageKeys('label')), 'nullable', 'string', 'max:255'],
            'url' => ['sometimes', 'required', 'string', 'max:2048'],
            'target' => ['sometimes', 'required', 'string', Rule::in(['_self', '_blank'])],
            'order' => ['nullable', 'integer', 'min:0'],
            // Prevent setting item as its own parent or child's parent
            'parent_id' => ['nullable', 'integer', 'exists:navigation_items,id', function ($attribute, $value, $fail) {
                 if ($value && $value == $this->route('navigation_item')->id) {
                     $fail('A navigation item cannot be its own parent.');
                 }
                 // Add check to prevent making it a child of its own descendants if needed
            }],
            'status' => ['sometimes', 'required', 'string', Rule::in(['published', 'draft'])],
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
}
