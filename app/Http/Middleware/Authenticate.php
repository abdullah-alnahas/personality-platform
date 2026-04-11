<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        if (! $request->expectsJson()) {
            // If the request is for an admin route, redirect to admin login
            if ($request->routeIs('admin.*')) {
                return route('admin.login');
            }
            // No public login route exists; always redirect to admin login
            return route('admin.login');
        }
        return null; // Return null for JSON requests (API)
    }
}
