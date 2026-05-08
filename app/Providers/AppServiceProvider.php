<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Neutralise the phar:// stream wrapper for web requests. Any file
        // function (file_get_contents, fopen, getimagesize, file_exists) that
        // resolves a phar:// path triggers metadata deserialization on PHP <8.0
        // and partial deserialization on >=8.0 — a known RCE primitive when
        // user input flows into a path argument. CLI commands keep the wrapper
        // because Composer / Symfony Console rely on it.
        if (php_sapi_name() !== 'cli' && in_array('phar', stream_get_wrappers(), true)) {
            stream_wrapper_unregister('phar');
        }
    }

    public function boot(): void
    {
        // Enforce a strong password policy for all admin accounts.
        Password::defaults(function () {
            return Password::min(12)
                ->letters()
                ->mixedCase()
                ->numbers()
                ->symbols()
                ->uncompromised();
        });
    }
}
