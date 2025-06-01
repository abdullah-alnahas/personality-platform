<?php namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use App\Models\Language;
use Illuminate\Support\Facades\Cache;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $defaultLocale = config("app.locale", "en"); // Provide a hardcoded default for safety
        $fallbackLocale = config("app.fallback_locale", "en"); // Provide a hardcoded default
        $sessionKey = "locale";

        $activeLanguageCodes = Cache::rememberForever(
            "active_language_codes_for_middleware",
            function () {
                return Language::where("is_active", true)
                    ->pluck("code")
                    ->toArray();
            }
        );

        // Ensure activeLanguageCodes is always an array, even if cache/DB returns null/empty
        if (!is_array($activeLanguageCodes) || empty($activeLanguageCodes)) {
            // Fallback to system defaults if no active languages are found
            $activeLanguageCodes = array_unique([
                $defaultLocale,
                $fallbackLocale,
            ]);
            Log::warning(
                "[SetLocale] No active languages found in cache/DB. Falling back to system defaults: " .
                    implode(", ", $activeLanguageCodes)
            );
        }

        $requestedLocale = null;

        if ($request->has("lang")) {
            $langParam = $request->query("lang");
            if (in_array($langParam, $activeLanguageCodes)) {
                $requestedLocale = $langParam;
                Log::info(
                    "[SetLocale] Locale '{$requestedLocale}' found in query parameter and is active."
                );
            } else {
                Log::warning(
                    "[SetLocale] Locale '{$langParam}' from query parameter '{$langParam}' is not active or invalid. Active: " .
                        implode(",", $activeLanguageCodes)
                );
            }
        }

        if (!$requestedLocale && Session::has($sessionKey)) {
            $sessionLocale = Session::get($sessionKey);
            if (in_array($sessionLocale, $activeLanguageCodes)) {
                $requestedLocale = $sessionLocale;
                Log::info(
                    "[SetLocale] Locale '{$requestedLocale}' found in session and is active."
                );
            } else {
                Log::warning(
                    "[SetLocale] Locale '{$sessionLocale}' from session is not active or invalid. Removing from session. Active: " .
                        implode(",", $activeLanguageCodes)
                );
                Session::forget($sessionKey);
            }
        }

        // If still no locale, try to detect from browser accept-language header
        if (!$requestedLocale && $request->header("Accept-Language")) {
            $browserLocales = $request->getLanguages(); // Gets languages sorted by quality
            foreach ($browserLocales as $browserLocale) {
                $browserLocaleShort = substr($browserLocale, 0, 2); // Try matching 'en' from 'en-US'
                if (in_array($browserLocale, $activeLanguageCodes)) {
                    $requestedLocale = $browserLocale;
                    break;
                } elseif (in_array($browserLocaleShort, $activeLanguageCodes)) {
                    $requestedLocale = $browserLocaleShort;
                    break;
                }
            }
            if ($requestedLocale) {
                Log::info(
                    "[SetLocale] Locale '{$requestedLocale}' detected from browser and is active."
                );
            } else {
                Log::info(
                    "[SetLocale] No browser locale matched active languages. Browser locales: " .
                        implode(", ", $browserLocales) .
                        ". Active: " .
                        implode(",", $activeLanguageCodes)
                );
            }
        }

        $finalLocale = $defaultLocale; // Start with app's default config

        if (
            $requestedLocale &&
            in_array($requestedLocale, $activeLanguageCodes)
        ) {
            $finalLocale = $requestedLocale;
        } elseif (
            Session::has($sessionKey) &&
            in_array(Session::get($sessionKey), $activeLanguageCodes)
        ) {
            $finalLocale = Session::get($sessionKey);
        } elseif (!in_array($finalLocale, $activeLanguageCodes)) {
            // If defaultLocale isn't active
            $finalLocale = $fallbackLocale; // Try fallback
            if (
                !in_array($finalLocale, $activeLanguageCodes) &&
                !empty($activeLanguageCodes)
            ) {
                $finalLocale = $activeLanguageCodes[0]; // Or first active one
            }
        }

        App::setLocale($finalLocale);
        Session::put($sessionKey, $finalLocale);

        if (class_exists(\Illuminate\Support\Carbon::class)) {
            \Illuminate\Support\Carbon::setLocale($finalLocale);
        }

        Log::info(
            "[SetLocale] Final application locale set to: {$finalLocale}"
        );

        return $next($request);
    }
}
