<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreNavigationItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('manage navigation');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'menu_location' => ['required', 'string', 'max:100'],
            'label' => ['required', 'array'],
            // Validate at least one language has a label provided
            'label.*' => ['required_without_all:'.implode(',', $this->getOtherLanguageKeys('label')), 'nullable', 'string', 'max:255'],
            'url' => ['required', 'string', 'max:2048'], // Increased max length for URLs
            'target' => ['required', 'string', Rule::in(['_self', '_blank'])],
            'order' => ['nullable', 'integer', 'min:0'],
            'parent_id' => ['nullable', 'integer', 'exists:navigation_items,id'],
            'status' => ['required', 'string', Rule::in(['published', 'draft'])],
        ];
    }

    /**
     * Helper to get keys for other languages for required_without_all rule.
     * Dynamically gets active languages later if Language model exists and is seeded.
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
