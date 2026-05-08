<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubscriptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Public form
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // No `unique` rule: a unique-violation produces a 422 with errors bag
        // while a fresh insert produces a 200 with success flash, which leaks
        // whether an email is on the list. Dedup is handled in the controller
        // via a constant-response code path; here we only validate format.
        return [
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
            ],
        ];
    }
}
