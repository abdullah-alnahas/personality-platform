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
    ];

    public array $translatable = [
        "name",
        "description",
        "quote",
        "meta_fields",
    ];

    protected $casts = [
        "name" => "array",
        "description" => "array",
        "quote" => "array",
        "meta_fields" => "array",
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
        $locale = $locale ?? App::currentLocale();
        $dbDriver = $query->getConnection()->getDriverName();

        // Customize JSON extraction based on database driver if needed
        // This example is primarily for MySQL/MariaDB.
        // For PostgreSQL, it would be: "{$column}->>'{$locale}'"
        // For SQLite, JSON functions might need to be enabled or handled differently.
        if ($dbDriver === "mysql" || $dbDriver === "mariadb") {
            return $query->orderBy(
                DB::raw(
                    "JSON_UNQUOTE(JSON_EXTRACT(`{$this->getTable()}`.`{$column}`, '$.\"{$locale}\"'))"
                ),
                $direction
            );
        } elseif ($dbDriver === "pgsql") {
            return $query->orderByRaw(
                "({$this->getTable()}.{$column}->>'{$locale}') {$direction}"
            );
        }
        // Add other database driver specifics if necessary, or fallback to no specific ordering if JSON functions are not straightforward.
        // For simplicity, if not mysql/pgsql, it won't apply special JSON ordering.
        // You might want to throw an exception or log a warning for unsupported drivers.
        // As a basic fallback (less efficient as it fetches all then sorts in PHP, doesn't work directly with query builder for DB sort):
        // return $query; // Or handle as an error / unsupported feature for other DBs

        // For now, let's assume MySQL/MariaDB or PostgreSQL as common choices with Laravel.
        // If using SQLite for testing, this might not work without extra setup.
        // If the driver is not recognized for specific JSON ordering, it will fall through and not apply it.
        // It's better to just apply the order and let it fail if the DB doesn't support it,
        // rather than silently not ordering, or to make the JSON_EXTRACT specific to MySQL only.
        // Let's stick to MySQL/MariaDB for this example for now.
        return $query->orderBy(
            DB::raw(
                "JSON_UNQUOTE(JSON_EXTRACT(`{$this->getTable()}`.`{$column}`, '$.\"{$locale}\"'))"
            ),
            $direction
        );
    }
}
