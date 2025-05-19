<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContentItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Check if the user has the permission to manage content items
        return $this->user()->can("manage content items");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "title" => ["required", "array"],
            // Ensure at least one language title is provided (example for default locale 'en')
            // A more robust rule might check if at least one of the configured locales has a title.
            "title." . config("app.locale", "en") => [
                "required",
                "string",
                "max:255",
            ],
            "title.*" => ["nullable", "string", "max:255"], // Allow other locales to be nullable if default is present

            "content_category_id" => [
                "required",
                "integer",
                "exists:content_categories,id",
            ],

            "content" => ["nullable", "array"],
            "content.*" => ["nullable", "string"], // Consider max length if needed

            "excerpt" => ["nullable", "array"],
            "excerpt.*" => ["nullable", "string", "max:1000"], // Example max length for excerpt

            "featured_image_alt_text" => ["nullable", "array"], // New field for alt text
            "featured_image_alt_text.*" => ["nullable", "string", "max:255"], // Alt text for each language

            "status" => [
                "required",
                "string",
                Rule::in(["published", "draft", "pending"]),
            ],
            "publish_date" => [
                "nullable",
                "date_format:Y-m-d H:i:s",
                "after_or_equal:today",
            ], // Ensure correct format if sent
            "is_featured_home" => ["sometimes", "boolean"],

            "featured_image" => [
                "nullable",
                "image",
                "mimes:jpeg,png,jpg,gif,webp",
                "max:2048",
            ], // 2MB Max
        ];
    }

    /**
     * Prepare the data for validation.
     * Convert checkbox value ('on' or null) to boolean.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            "is_featured_home" => $this->boolean("is_featured_home"),
            // If publish_date is sent as a non-ISO string from DateTimePicker, it might need formatting here
            // However, if dayjs.toISOString() is used on frontend, it should be fine.
        ]);
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        $attributes = [];
        foreach (
            config("translatable.locales", ["en", "ar", "tr"])
            as $locale
        ) {
            $attributes["title.{$locale}"] = "title ({$locale})";
            $attributes["content.{$locale}"] = "content ({$locale})";
            $attributes["excerpt.{$locale}"] = "excerpt ({$locale})";
            $attributes[
                "featured_image_alt_text.{$locale}"
            ] = "featured image alt text ({$locale})";
        }
        return $attributes;
    }

    /**
     * Helper to get keys for other languages for required_without_all rule.
     * This is a simplified version. For robust 'at least one locale required'
     * you might need a custom validation rule or more complex logic.
     */
    protected function getOtherLanguageKeys(string $field): array
    {
        $keys = [];
        $activeLanguages = config("translatable.locales", ["en", "ar", "tr"]); // Fallback if not configured
        foreach ($activeLanguages as $langCode) {
            if ($langCode !== config("app.locale", "en")) {
                // Exclude default locale for required_without_all
                $keys[] = $field . "." . $langCode;
            }
        }
        return $keys;
    }
}
