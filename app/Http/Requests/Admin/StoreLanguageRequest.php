<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLanguageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can("manage languages");
    }

    public function rules(): array
    {
        return [
            "code" => [
                "required",
                "string",
                "alpha_dash:ascii",
                "max:10",
                Rule::unique("languages", "code"),
            ],
            "name" => ["required", "string", "max:255"],
            "native_name" => ["required", "string", "max:255"],
            "is_active" => ["required", "boolean"],
            // 'is_rtl' => ['required', 'boolean'], // Removed
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            "is_active" => $this->boolean("is_active"),
            // 'is_rtl' => $this->boolean('is_rtl'), // Removed
        ]);
    }
}
