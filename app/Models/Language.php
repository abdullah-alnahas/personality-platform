<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache; // For cache clearing

/**
 * App\Models\Language
 *
 * Represents a language supported by the platform.
 *
 * @property string $code The language code (e.g., 'en', 'ar'). Primary Key.
 * @property string $name The common name of the language (e.g., 'English').
 * @property string $native_name The native name of the language (e.g., 'English', 'العربية').
 * @property bool $is_active Whether the language is currently active on the site.
 * @property bool $is_rtl Whether the language is right-to-left (inferred).
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Language newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Language newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Language query()
 * @mixin \Eloquent
 */
class Language extends Model
{
    use HasFactory;

    protected $primaryKey = "code";
    public $incrementing = false;
    protected $keyType = "string";

    /**
     * The attributes that are mass assignable.
     * Note: is_rtl is handled by the saving event.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        "code",
        "name",
        "native_name",
        "is_active",
        // 'is_rtl', // Removed as it will be inferred
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        "is_active" => "boolean",
        "is_rtl" => "boolean", // Keep cast for reading from DB
    ];

    /**
     * List of known RTL language codes (ISO 639-1 or common prefixes).
     * This list can be expanded.
     * @var array<string>
     */
    protected const RTL_CODES = [
        "ar",
        "he",
        "fa",
        "ur",
        "dv",
        "ps",
        "yi",
        "syr",
    ];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted(): void
    {
        static::saving(function (Language $language) {
            // Infer is_rtl based on the language code
            $languageCodePrefix = strtolower(substr($language->code, 0, 2));
            $language->is_rtl = in_array($languageCodePrefix, self::RTL_CODES);

            // Clear caches when a language is saved
            Cache::forget("available_locales");
            Cache::forget("translatable_locales_config");
        });

        static::deleted(function () {
            // Clear caches when a language is deleted
            Cache::forget("available_locales");
            Cache::forget("translatable_locales_config");
        });
    }
}
