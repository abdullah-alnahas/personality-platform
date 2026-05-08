<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Database\Eloquent\Builder; // <-- Add this
use Illuminate\Support\Facades\App; // <-- Add this
use Illuminate\Support\Facades\DB; // <-- Add this (optional if you prefer DB::raw, or use $query->raw for some dbs)

class ContentCategory extends Model
{
    use HasFactory, HasTranslations, HasSlug;

    protected $fillable = [
        "name",
        "slug",
        "description",
        "quote",
        "icon",
        "image",
        "order",
        "status",
        "meta_fields",
        "page_id",
    ];

    public array $translatable = [
        "name",
        "description",
        "quote",
        "meta_fields",
    ];

    protected $casts = [
        "order" => "integer",
        "page_id" => "integer",
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom("name")
            ->saveSlugsTo("slug")
            ->doNotGenerateSlugsOnUpdate();
    }

    public function items()
    {
        return $this->hasMany(ContentItem::class);
    }

    public function page()
    {
        return $this->belongsTo(Page::class);
    }

    public function scopePublished($query)
    {
        return $query->where("status", "published");
    }

    /**
     * Scope a query to order by a JSON translation.
     *
     * @param Builder $query
     * @param string  $column        e.g. 'name'
     * @param string  $direction     'asc' or 'desc'
     * @param string|null $locale    default: current app locale
     *
     * @return Builder
     */
    public function scopeOrderByTranslatable(
        Builder $query,
        string $column,
        string $direction = "asc",
        ?string $locale = null
    ): Builder {
        // Whitelist all interpolated values to prevent SQL injection.
        $allowedColumns = $this->translatable;
        $column = in_array($column, $allowedColumns, true) ? $column : 'name';

        $direction = strtolower($direction) === 'desc' ? 'DESC' : 'ASC';

        $allowedLocales = config('translatable.locales', ['ar', 'en', 'tr']);
        $rawLocale = $locale ?? App::currentLocale();
        $locale = in_array($rawLocale, $allowedLocales, true) ? $rawLocale : 'ar';

        // Eloquent's JSON column syntax compiles to driver-appropriate JSON
        // extraction with parameter binding under the hood — replaces the
        // earlier `DB::raw` interpolation foot-gun while preserving behaviour
        // on MySQL/MariaDB and adding PostgreSQL/SQLite support for free.
        return $query->orderBy("{$column}->{$locale}", $direction);
    }
}
