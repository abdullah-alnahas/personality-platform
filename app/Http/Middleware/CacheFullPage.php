<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CacheFullPage
{
    /**
     * Cache TTL in seconds.
     */
    protected const TTL = 3600;

    /**
     * Handle an incoming request.
     *
     * Only caches GET requests for guest (unauthenticated) users.
     * Returns cached response with X-Cache: HIT header when available,
     * or caches fresh 200 responses with X-Cache: MISS header.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->isMethod('GET') || $request->user() !== null) {
            return $next($request);
        }

        // Don't cache pages that render forms — a cached CSRF token would be stale
        // for subsequent visitors and cause 419 CSRF mismatch on submission.
        $formRoutes = ['contact.show', 'subscribe'];
        foreach ($formRoutes as $routeName) {
            if ($request->routeIs($routeName)) {
                return $next($request);
            }
        }

        // Don't cache responses with flash data (they're one-time messages)
        if ($request->session()->has('_flash')) {
            $flashData = $request->session()->get('_flash.new', []);
            if (!empty($flashData)) {
                return $next($request);
            }
        }

        $locale = app()->getLocale();
        // Include X-Inertia header in key so SPA navigations (which expect JSON)
        // never receive a cached full HTML page response.
        $isInertia = $request->header('X-Inertia') ? '1' : '0';
        $cacheKey = 'full_page_' . md5($request->fullUrl() . $locale . $isInertia);

        $cached = Cache::get($cacheKey);

        if ($cached !== null) {
            /** @var Response $response */
            $response = response($cached['body'], $cached['status'])
                ->withHeaders($cached['headers']);
            $response->headers->set('X-Cache', 'HIT');

            return $response;
        }

        /** @var Response $response */
        $response = $next($request);

        if ($response->getStatusCode() === 200) {
            // Strip session/auth headers before caching — never cache Set-Cookie,
            // X-CSRF-TOKEN, or similar headers that are user-specific.
            $sensitiveHeaders = ['set-cookie', 'x-csrf-token', 'x-xsrf-token'];
            $headers = array_map(
                fn (array $values): string => $values[0] ?? '',
                array_diff_key(
                    $response->headers->all(),
                    array_flip($sensitiveHeaders)
                )
            );

            // Tell proxies/CDNs that HTML vs JSON responses differ for same URL.
            $response->headers->set('Vary', 'X-Inertia');

            Cache::put($cacheKey, [
                'body'    => $response->getContent(),
                'status'  => $response->getStatusCode(),
                'headers' => $headers,
            ], self::TTL);

            $response->headers->set('X-Cache', 'MISS');
        }

        return $response;
    }
}
