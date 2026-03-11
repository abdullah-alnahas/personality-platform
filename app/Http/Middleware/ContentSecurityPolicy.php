<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ContentSecurityPolicy
{
    /**
     * Add Content-Security-Policy headers to the response.
     *
     * Policy:
     * - default-src 'self'
     * - script-src  'self'
     * - style-src   'self' 'unsafe-inline' (needed for MUI inline styles)
     * - img-src     'self' data: https:
     * - font-src    'self' https:
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var Response $response */
        $response = $next($request);

        $vite = app()->environment('local') ? 'http://127.0.0.1:5173 ws://127.0.0.1:5173' : '';
        $fonts = 'https://fonts.googleapis.com https://fonts.gstatic.com https://fonts.bunny.net';

        $directives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' {$vite}",
            "style-src 'self' 'unsafe-inline' {$fonts}",
            "img-src 'self' data: https:",
            "font-src 'self' {$fonts} https:",
            "connect-src 'self' {$vite}",
        ];

        $response->headers->set(
            'Content-Security-Policy',
            implode('; ', $directives)
        );

        return $response;
    }
}
