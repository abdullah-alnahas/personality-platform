<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Page extends Model
{
    use HasFactory, HasTranslations, HasSlug;

    protected $fillable = [
        'title',
        'slug',
        'status',
        'meta_fields',
        'is_homepage',
        'layout',
        'scheduled_at',
    ];

    public array $translatable = [
        'title',
        'meta_fields',
    ];

    protected $casts = [
        'title' => 'array',
        'meta_fields' => 'array',
        'is_homepage' => 'boolean',
        'scheduled_at' => 'datetime',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(function (Page $page): string {
                // Use primary locale title, fallback through available translations
                return $page->getTranslation('title', 'en')
                    ?: $page->getTranslation('title', app()->getLocale())
                    ?: collect($page->getTranslations('title'))->first()
                    ?: '';
            })
            ->saveSlugsTo('slug')
            ->doNotGenerateSlugsOnUpdate();
    }

    public function blocks()
    {
        return $this->hasMany(PageBlock::class)->orderBy('display_order');
    }

    public function publishedBlocks()
    {
        return $this->hasMany(PageBlock::class)
            ->where('status', 'published')
            ->orderBy('display_order');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    public function scopeHomepage(Builder $query): Builder
    {
        return $query->where('is_homepage', true);
    }

    protected static function booted(): void
    {
        static::saving(function (Page $page) {
            if ($page->is_homepage && $page->isDirty('is_homepage')) {
                \DB::transaction(function () use ($page) {
                    static::where('id', '!=', $page->id ?? 0)
                        ->where('is_homepage', true)
                        ->update(['is_homepage' => false]);
                });
            }
        });
    }
}
