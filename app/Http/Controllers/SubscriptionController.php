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
            // Create new subscriber (pending confirmation - implement confirmation later if needed)
            Subscriber::create([
                'email' => $validated['email'],
                'status' => 'confirmed', // For MVP, directly confirm
                'confirmed_at' => now(), // For MVP
                // 'status' => 'pending', // Use pending for double opt-in
                // 'token' => Str::random(60), // Generate token for double opt-in
            ]);

            // Optional: Send confirmation email for double opt-in
            // Mail::to($newSubscriber->email)->send(new ConfirmSubscription($newSubscriber));
            // return back()->with('success', 'Please check your email to confirm your subscription.');

            return back()->with('success', 'Thank you for subscribing!'); // MVP success message
        } else {
            // Already subscribed and confirmed/pending - handled by unique validation rule mostly
            return back()->with('error', 'This email is already subscribed or pending confirmation.');
        }
    }
}
