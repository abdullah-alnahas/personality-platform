<?php namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQuoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can("manage quotes");
    }

    public function rules(): array
    {
        $rules = [
            "text" => ["required", "array"],
            "source" => ["nullable", "array"],
            "status" => [
                "required",
                "string",
                Rule::in(["published", "draft", "pending"]),
            ],
            "is_featured" => ["sometimes", "boolean"],
        ];

        foreach (config("translatable.locales") as $locale) {
            $rules["text." . $locale] = [
                "required_without_all:" .
                $this->getOtherLanguageKeys("text", $locale),
                "nullable",
                "string",
                "max:1000",
            ];
            $rules["source." . $locale] = ["nullable", "string", "max:255"];
        }

        return $rules;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            "is_featured" => $this->boolean("is_featured"),
        ]);
    }

    protected function getOtherLanguageKeys(
        string $field,
        string $currentLocale
    ): string {
        $keys = [];
        foreach (config("translatable.locales") as $locale) {
            if ($locale !== $currentLocale) {
                $keys[] = $field . "." . $locale;
            }
        }
        return implode(",", $keys);
    }

    public function attributes(): array
    {
        $attributes = [];
        foreach (config("translatable.locales") as $locale) {
            $attributes["text.{$locale}"] = "text ({$locale})";
            $attributes["source.{$locale}"] = "source ({$locale})";
        }
        return $attributes;
    }
}
