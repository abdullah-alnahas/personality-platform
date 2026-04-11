<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubscriptionRequest;
use App\Models\Subscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
// Optional: Mail facade and Mailable for confirmation
// use Illuminate\Support\Facades\Mail;
// use App\Mail\ConfirmSubscription;

class SubscriptionController extends Controller
{
    /**
     * Handle the incoming subscription request.
     */
    public function __invoke(StoreSubscriptionRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // Check if email exists but is unsubscribed - reactivate if needed (optional)
        $subscriber = Subscriber::where('email', $validated['email'])->first();

        if ($subscriber && $subscriber->status === 'unsubscribed') {
            // Option 1: Simple re-activation (no double opt-in)
            $subscriber->status = 'confirmed'; // Or 'pending' if re-confirming
            $subscriber->confirmed_at = now(); // Or null if pending
            $subscriber->token = null; // Clear old token
            $subscriber->save();
            return back()->with('success', 'You have been re-subscribed successfully!');

            // Option 2: Trigger re-confirmation email (more complex)
            // ... generate new token, send email ...
            // return back()->with('success', 'Please check your email to confirm your subscription.');
        } elseif (!$subscriber) {
            try {
                $newSubscriber = Subscriber::create([
                    'email' => $validated['email'],
                ]);
                $newSubscriber->status = 'confirmed';
                $newSubscriber->confirmed_at = now();
                $newSubscriber->save();
            } catch (\Illuminate\Database\QueryException $e) {
                if ($e->errorInfo[1] == 1062) {
                    return back()->with('success', 'If this address is new, you will be subscribed shortly.');
                }
                throw $e;
            }

            return back()->with('success', 'Thank you for subscribing!');
        } else {
            // Generic response — do not confirm whether the email is already subscribed.
            return back()->with('success', 'If this address is new, you will be subscribed shortly.');
        }
    }
}
