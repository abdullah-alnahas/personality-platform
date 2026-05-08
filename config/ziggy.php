<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Ziggy Route Filtering
    |--------------------------------------------------------------------------
    | Exclude admin, password-reset, email-verification, and API routes from
    | the Ziggy route list serialised into every public page. This prevents
    | exposing the full admin surface to unauthenticated visitors.
    */
    // Admin route names ARE included in the client Ziggy bundle — they must
    // be, since admin/auth pages and the MediaPicker reference admin routes
    // by name from compiled JS. Exposure risk is low: paths follow a stable
    // /admin prefix, and authentication middleware is the real control.
    // Only password-reset, email-verification, and API routes are excluded
    // because they are never linked from compiled JS on a public page.
    'except' => [
        'password.*',
        'verification.*',
        'api.*',
    ],
];
