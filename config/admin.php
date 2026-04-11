<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Admin URL Path
    |--------------------------------------------------------------------------
    |
    | The URL segment used to access the admin panel. Changing this from the
    | default 'admin' makes the control panel harder to discover by scanners.
    |
    | After changing ADMIN_PATH in .env, run:
    |   php artisan route:clear && php artisan config:clear
    |
    | Default: admin  →  http://yourdomain.com/admin/login
    |
    */
    'path' => env('ADMIN_PATH', 'admin'),
];
