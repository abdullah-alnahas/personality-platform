<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Per-email throttle on top of the IP-keyed route limiter so a botnet
        // cannot mailbox-flood a target by rotating IPs (see audit M1).
        $emailKey = 'pwd_reset_email:' . hash('sha256', Str::lower($request->input('email')));
        $count = (int) Cache::get($emailKey, 0);
        if ($count >= 3) {
            // Behave identically to the success path so we don't leak whether
            // an account exists or has hit the limit.
            return back()->with('status', __(Password::RESET_LINK_SENT));
        }
        Cache::put($emailKey, $count + 1, now()->addHour());

        $status = Password::sendResetLink($request->only('email'));

        if ($status == Password::RESET_LINK_SENT) {
            return back()->with('status', __($status));
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }
}
