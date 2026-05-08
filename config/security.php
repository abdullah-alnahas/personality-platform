<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Honeypot Field
    |--------------------------------------------------------------------------
    | Hidden form field name that bots fill but humans leave empty. Rotate per
    | deploy via the HONEYPOT_FIELD env var to defeat trained bot scrapers.
    | Must satisfy HTML name attribute rules: ASCII letters, digits, '_', '-'.
    */
    'honeypot' => [
        'field' => env('HONEYPOT_FIELD', '_confirm_email'),
    ],
];
