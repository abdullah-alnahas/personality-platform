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

        // Constant-response endpoint: every code path below MUST return the
        // same generic flash message. Differentiating responses (e.g. "thank
        // you" vs "already subscribed" vs "re-subscribed") lets an attacker
        // enumerate which addresses are on the list by submitting a candidate
        // email and reading the message. The DB work below still varies in
        // small ways, but the user-visible signal is identical.
        $genericMessage = __('If this address is new, you will be subscribed shortly.');

        $subscriber = Subscriber::where('email', $validated['email'])->first();

        if ($subscriber && $subscriber->status === 'unsubscribed') {
            $subscriber->status = 'confirmed';
            $subscriber->confirmed_at = now();
            $subscriber->token = null;
            $subscriber->save();
        } elseif (!$subscriber) {
            try {
                $newSubscriber = Subscriber::create([
                    'email' => $validated['email'],
                ]);
                $newSubscriber->status = 'confirmed';
                $newSubscriber->confirmed_at = now();
                $newSubscriber->save();
            } catch (\Illuminate\Database\QueryException $e) {
                // Race-condition duplicate (1062) — fall through to generic
                // response so it cannot be distinguished from a fresh insert.
                if ($e->errorInfo[1] != 1062) {
                    throw $e;
                }
            }
        }
        // If subscriber exists with status=pending/confirmed, do nothing —
        // same generic response.

        return back()->with('success', $genericMessage);
    }
}
