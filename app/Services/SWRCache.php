<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

/**
 * Stale-While-Revalidate cache helper.
 *
 * Serves stale data immediately while scheduling a background refresh after
 * the current response has been sent. Prevents cache stampedes on popular keys.
 *
 * Usage:
 *   SWRCache::remember('my_key', 300, fn() => expensive_query());
 *
 * Storage layout (per $key):
 *   $key          — "fresh" window (short TTL, e.g. 5 min)
 *   $key . ':bg'  — "stale" window (long TTL, e.g. 60 min)
 *   $key . ':lk'  — refresh lock (30 s) — prevents concurrent background refreshes
 */
class SWRCache
{
    /**
     * @param  string    $key       Cache key
     * @param  int       $freshTtl  Seconds until a background refresh is triggered (default: 300)
     * @param  callable  $callback  Closure that computes the fresh value
     * @return mixed
     */
    public static function remember(string $key, int $freshTtl, callable $callback): mixed
    {
        $staleKey = $key . ':bg';
        $lockKey  = $key . ':lk';
        $staleTtl = $freshTtl * 12; // stale copy lives 12× longer (default ≈1 h)

        // 1. Fresh data — return immediately, no work needed
        $fresh = Cache::get($key);
        if ($fresh !== null) {
            return $fresh;
        }

        // 2. Stale data exists — serve it and schedule a background refresh
        $stale = Cache::get($staleKey);
        if ($stale !== null) {
            if (!Cache::has($lockKey)) {
                Cache::put($lockKey, 1, 30);
                dispatch(function () use ($key, $staleKey, $freshTtl, $staleTtl, $lockKey, $callback) {
                    try {
                        $data = $callback();
                        Cache::put($key, $data, $freshTtl);
                        Cache::put($staleKey, $data, $staleTtl);
                    } finally {
                        Cache::forget($lockKey);
                    }
                })->afterResponse();
            }
            return $stale;
        }

        // 3. Cold start — compute synchronously (first request or after full expiry)
        $data = $callback();
        Cache::put($key, $data, $freshTtl);
        Cache::put($staleKey, $data, $staleTtl);
        return $data;
    }

    /**
     * Invalidate both the fresh and stale copies for a key.
     * Call from Observers whenever the underlying data changes.
     */
    public static function forget(string $key): void
    {
        Cache::forget($key);
        Cache::forget($key . ':bg');
        Cache::forget($key . ':lk');
    }
}
