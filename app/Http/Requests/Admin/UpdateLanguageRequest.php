<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLanguageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can("manage languages");
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $languageCode = $this->route("language")
            ? $this->route("language")->code
            : null;

        return [
            // Code is typically not updatable, but if it were:
            // 'code' => ['sometimes', 'required', 'string', 'alpha_dash:ascii', 'max:10', Rule::unique('languages', 'code')->ignore($languageCode, 'code')],
            "name" => ["sometimes", "required", "string", "max:255"],
            "native_name" => ["sometimes", "required", "string", "max:255"],
            "is_active" => ["sometimes", "required", "boolean"],
            "is_rtl" => ["sometimes", "required", "boolean"],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has("is_active")) {
            $this->merge(["is_active" => $this->boolean("is_active")]);
        }
        if ($this->has("is_rtl")) {
            $this->merge(["is_rtl" => $this->boolean("is_rtl")]);
        }
    }
}
