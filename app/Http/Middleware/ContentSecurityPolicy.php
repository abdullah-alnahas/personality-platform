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

        $directives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' https:",
        ];

        $response->headers->set(
            'Content-Security-Policy',
            implode('; ', $directives)
        );

        return $response;
    }
}
