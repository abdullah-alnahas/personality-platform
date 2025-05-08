<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class ContentCategory extends Model
{
    use HasFactory, HasTranslations, HasSlug;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'quote',
        'icon',
        'image',
        'order',
        'status',
        'meta_fields',
    ];

    public array $translatable = [
        'name',
        'description',
        'quote',
        'meta_fields',
    ];

    protected $casts = [
        'meta_fields' => 'array',
        // Cast translatable json fields for easier access if needed,
        // though HasTranslations handles it.
        'name' => 'array',
        'description' => 'array',
        'quote' => 'array',
    ];

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug')
            ->doNotGenerateSlugsOnUpdate(); // Or configure as needed
    }

    // Relationships
    public function items()
    {
        return $this->hasMany(ContentItem::class);
    }
    /**
      * Scope a query to only include published categories.
      *
      * @param  \Illuminate\Database\Eloquent\Builder  $query
      * @return \Illuminate\Database\Eloquent\Builder
      */
      public function scopePublished($query)
      {
          return $query->where('status', 'published');
      }
}
