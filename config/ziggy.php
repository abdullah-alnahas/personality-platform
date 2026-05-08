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
    'except' => [
        'admin.*',
        'password.*',
        'verification.*',
        'api.*',
    ],
];
