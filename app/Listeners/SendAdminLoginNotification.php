<?php

namespace App\Listeners;

use App\Mail\AdminLoginNotification;
use Illuminate\Auth\Events\Login;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendAdminLoginNotification implements ShouldQueue
{
    public function handle(Login $event): void
    {
        $user = $event->user;

        if (!$user || empty($user->email)) {
            return;
        }

        // Only notify admin-role users — public/guest users would just be spam.
        if (method_exists($user, 'hasAnyRole') && !$user->hasAnyRole(['Super Admin', 'Editor', 'Admin'])) {
            return;
        }

        $request = request();
        $ip = $request->ip() ?? 'unknown';
        $ua = substr((string) $request->userAgent(), 0, 200) ?: 'unknown';

        // Skip duplicate alerts when the same user signs in repeatedly from the
        // same IP within an hour. Avoids burying real anomalies in noise.
        $cacheKey = sprintf('login_notif:%d:%s', $user->id, hash('sha256', $ip));
        if (Cache::has($cacheKey)) {
            return;
        }
        Cache::put($cacheKey, 1, now()->addHour());

        try {
            Mail::to($user->email)->send(new AdminLoginNotification(
                userName: $user->name ?? 'Admin',
                ip: $ip,
                userAgent: $ua,
                timestamp: now()->toDayDateTimeString() . ' UTC',
            ));
        } catch (\Throwable $e) {
            // Mail failure must not break login — log and move on.
            Log::warning('Login notification mail failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
