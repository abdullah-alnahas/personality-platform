<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Escalating lockout durations keyed by minimum failure count (descending).
     * 20+ failures → 24 h, 10+ → 1 h, 5+ → 15 min, any → 1 min.
     */
    private const LOCKOUT_STEPS = [
        20 => 86400,
        10 => 3600,
        5  => 900,
        1  => 60,
    ];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'          => ['required', 'string', 'email'],
            'password'       => ['required', 'string'],
            '_confirm_email' => ['present', 'max:0'], // honeypot — must remain empty
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        // Honeypot: a real browser never fills this field; bots usually do.
        // Return generic auth error so the rejection reason is not revealed.
        if ($this->input('_confirm_email') !== '') {
            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        $this->ensureIsNotRateLimited();

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            $this->recordFailedAttempt();

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        $this->clearAttempts();
    }

    /**
     * Throw if the IP+email pair is currently locked out.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        $lockedUntil = Cache::get($this->lockKey());

        if (! $lockedUntil || now()->timestamp >= $lockedUntil) {
            return;
        }

        $seconds = max(1, $lockedUntil - now()->timestamp);

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Increment the failure counter and set an escalating lockout window.
     * The counter persists for 24 h so it survives multiple short windows.
     */
    private function recordFailedAttempt(): void
    {
        $failCount = Cache::get($this->countKey(), 0) + 1;
        Cache::put($this->countKey(), $failCount, now()->addHours(24));

        $decaySeconds = 60;
        foreach (self::LOCKOUT_STEPS as $threshold => $seconds) {
            if ($failCount >= $threshold) {
                $decaySeconds = $seconds;
                break;
            }
        }

        Cache::put($this->lockKey(), now()->addSeconds($decaySeconds)->timestamp, $decaySeconds);

        event(new Lockout($this));
    }

    private function clearAttempts(): void
    {
        Cache::forget($this->countKey());
        Cache::forget($this->lockKey());
    }

    /** Stable key combining email + IP, used as base for both cache keys. */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')) . '|' . $this->ip());
    }

    private function countKey(): string
    {
        return 'login_fail_count:' . $this->throttleKey();
    }

    private function lockKey(): string
    {
        return 'login_locked_until:' . $this->throttleKey();
    }
}
