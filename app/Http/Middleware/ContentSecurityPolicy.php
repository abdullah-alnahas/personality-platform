<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Sets Content-Security-Policy and all other standard security headers.
 *
 * CSP notes:
 * - style-src requires 'unsafe-inline' because MUI injects inline styles.
 * - script-src allows 'unsafe-inline' only in local env (Vite HMR requirement).
 */
class ContentSecurityPolicy
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        $vite = app()->environment('local') ? 'http://127.0.0.1:5173 ws://127.0.0.1:5173' : '';
        $fonts = 'https://fonts.googleapis.com https://fonts.gstatic.com https://fonts.bunny.net';

        $directives = [
            "default-src 'self'",
            "script-src 'self'" . (app()->environment('local') ? " 'unsafe-inline'" : '') . " {$vite}",
            "style-src 'self' 'unsafe-inline' {$fonts}",
            "img-src 'self' data: https:",
            "font-src 'self' {$fonts} https:",
            "connect-src 'self' {$vite}",
            "frame-ancestors 'none'",
            "object-src 'none'",
            "base-uri 'self'",
        ];

        $response->headers->set(
            'Content-Security-Policy',
            implode('; ', $directives)
        );

        // Prevent clickjacking
        $response->headers->set('X-Frame-Options', 'DENY');

        // Prevent MIME-type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Limit referrer information leakage
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Disable unnecessary browser features
        $response->headers->set(
            'Permissions-Policy',
            'camera=(), microphone=(), geolocation=(), payment=()'
        );

        // HSTS: only set on HTTPS to avoid breaking HTTP dev environments
        if ($request->isSecure()) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains'
            );
        }

        return $response;
    }
}
