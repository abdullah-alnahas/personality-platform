<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLanguageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can("manage languages");
    }

    public function rules(): array
    {
        // $languageCode = $this->route('language') ? $this->route('language')->code : null; // Not needed if code is not updatable

        return [
            "name" => ["sometimes", "required", "string", "max:255"],
            "native_name" => ["sometimes", "required", "string", "max:255"],
            "is_active" => ["sometimes", "required", "boolean"],
            // 'is_rtl' => ['sometimes', 'required', 'boolean'], // Removed
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has("is_active")) {
            $this->merge(["is_active" => $this->boolean("is_active")]);
        }
        // if ($this->has('is_rtl')) { // Removed
        //     $this->merge(['is_rtl' => $this->boolean('is_rtl')]);
        // }
    }
}
