<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Language
 *
 * Represents a language supported by the platform.
 *
 * @property string $code The language code (e.g., 'en', 'ar'). Primary Key.
 * @property string $name The common name of the language (e.g., 'English').
 * @property string $native_name The native name of the language (e.g., 'English', 'العربية').
 * @property bool $is_active Whether the language is currently active on the site.
 * @property bool $is_rtl Whether the language is right-to-left.
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

    /**
     * The primary key associated with the table.
     * The 'code' column (e.g., 'en', 'ar') is the primary key.
     *
     * @var string
     */
    protected $primaryKey = "code";

    /**
     * Indicates if the primary key is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The "type" of the primary key ID.
     *
     * @var string
     */
    protected $keyType = "string";

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        "code",
        "name",
        "native_name",
        "is_active",
        "is_rtl",
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        "is_active" => "boolean",
        "is_rtl" => "boolean",
    ];
}
