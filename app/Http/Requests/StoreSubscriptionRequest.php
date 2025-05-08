<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Subscriber;

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
        return [
            // Ensure email is unique in the subscribers table, ignoring unsubscribed ones
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('subscribers')->where(function ($query) {
                    // Allow re-subscription if previously unsubscribed or pending for a long time
                    // For MVP, simple unique check is okay. Refine later if needed.
                    return $query->whereIn('status', ['pending', 'confirmed']);
                })
                // More complex logic for re-subscribing unsubscribed users can be added later
            ],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'This email address is already subscribed.',
        ];
    }
}
