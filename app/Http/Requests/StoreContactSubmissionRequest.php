<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactSubmissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Everyone can submit the contact form.
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
        return [
            'name'            => ['required', 'string', 'max:255'],
            'email'           => ['required', 'string', 'email', 'max:255'],
            'message'         => ['required', 'string', 'max:5000'],
            '_confirm_email'  => ['present', 'max:0'], // honeypot — bots fill it, humans leave it empty
        ];
    }

    public function messages(): array
    {
        return [
            '_confirm_email.max' => 'Invalid submission.',
        ];
    }
}
