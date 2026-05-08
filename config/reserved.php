<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Reserved Slugs
    |--------------------------------------------------------------------------
    | Words that must not be used as page / content-item / content-category
    | slugs because they collide with framework, admin, or top-level public
    | routes. Lowercase only — slug regex enforces lowercase already.
    */
    'slugs' => [
        // Framework / Laravel reserved
        'api', 'storage', 'public', 'vendor', 'css', 'js', 'fonts', 'images',
        'build', '_ignition', 'horizon', 'telescope', 'livewire',
        // Admin / auth
        'admin', 'login', 'logout', 'register', 'password', 'forgot-password',
        'reset-password', 'confirm-password', 'email', 'verify', 'profile',
        'dashboard',
        // Top-level public route names
        'item', 'category', 'page', 'search', 'contact', 'about', 'home',
        'subscribe', 'sitemap', 'robots', 'csp-report',
    ],

    /*
    | Slug regex pattern. Lowercase letter start, then lowercase / digit / hyphen.
    | Mirrors routes/web.php constraint. Used in validation messages.
    */
    'slug_pattern' => '/^[a-z][a-z0-9-]{0,254}$/',
];
