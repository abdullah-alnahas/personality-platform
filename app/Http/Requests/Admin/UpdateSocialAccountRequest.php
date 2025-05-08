<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSocialAccountRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('manage social accounts');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $platforms = ['facebook', 'instagram', 'youtube', 'telegram', 'x', 'twitter', 'linkedin', 'tiktok', 'other'];

        return [
             'platform' => ['sometimes', 'required', 'string', Rule::in($platforms)],
             'url' => ['sometimes', 'required', 'url', 'max:2048'],
             'account_name' => ['nullable', 'array'],
             'account_name.*' => ['nullable', 'string', 'max:255'],
             'display_order' => ['nullable', 'integer', 'min:0'],
             'status' => ['sometimes', 'required', 'string', Rule::in(['active', 'inactive'])],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'account_name.*' => 'account name',
        ];
    }
}
