<?php namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Language extends Model
{
    use HasFactory;

    protected $primaryKey = "code";
    public $incrementing = false;
    protected $keyType = "string";

    protected $fillable = ["code", "name", "native_name", "is_active", "is_rtl"];
    protected $casts = ["is_active" => "boolean", "is_rtl" => "boolean"];

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

    protected static function booted(): void
    {
        static::saving(function (Language $language) {
            $languageCodePrefix = strtolower(substr($language->code, 0, 2));
            $language->is_rtl = in_array($languageCodePrefix, self::RTL_CODES);
        });

        // Cache clearing handled by LanguageObserver — no duplication here
    }
}
