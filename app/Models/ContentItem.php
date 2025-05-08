<?php
// Edit file: app/Models/ContentItem.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia; // Import HasMedia
use Spatie\MediaLibrary\InteractsWithMedia; // Import InteractsWithMedia
use Spatie\Translatable\HasTranslations;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

// Implement the HasMedia interface
class ContentItem extends Model implements HasMedia
{
    // Add HasFactory (likely already there), HasTranslations, HasSlug, SoftDeletes, InteractsWithMedia traits
    use HasFactory, HasTranslations, HasSlug, SoftDeletes, InteractsWithMedia;

    protected $fillable = [
        'content_category_id',
        'user_id', // Author
        'title',
        'slug',
        'content',
        'excerpt',
        'status',
        'publish_date',
        'meta_fields',
        'is_featured_home',
    ];

    public array $translatable = [
        'title',
        'content',
        'excerpt',
        'meta_fields',
    ];

    protected $casts = [
        // Ensure correct casting for translatable JSON fields and others
        'title' => 'array',
        'content' => 'array',
        'excerpt' => 'array',
        'meta_fields' => 'array',
        'publish_date' => 'datetime',
        'is_featured_home' => 'boolean',
    ];

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title') // Generate slug from the title
            ->saveSlugsTo('slug')
            ->doNotGenerateSlugsOnUpdate(); // Keep slug same on update unless title changes significantly (handled by package)
    }

    // Relationships
    public function category()
    {
        // Define relationship to ContentCategory
        return $this->belongsTo(ContentCategory::class, 'content_category_id');
    }

    public function author()
    {
        // Define relationship to User (author)
        return $this->belongsTo(User::class, 'user_id');
    }

    // Media Library Configuration (Example for a featured image)
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('featured_image')
            ->singleFile() // Only allow one featured image
            ->useDisk('public') // Optionally specify disk
            ->withResponsiveImages() // Optionally enable responsive images later
            // Add conversions later if needed
            ->registerMediaConversions(function (Media $media = null) {
                $this->addMediaConversion('thumbnail')
                      ->width(150)
                      ->height(150)
                      ->sharpen(10);
            });
    }
    /**
     * Get the URL for the original featured image.
     *
     * @return string|null
     */
    public function getOriginalFeaturedImageUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('featured_image');
    }
    /**
     * Get the URL for the thumbnail featured image.
     * Define a 'thumbnail' conversion in registerMediaConversions first.
     *
     * @return string|null
     */
    public function getThumbnailFeaturedImageUrlAttribute(): ?string
    {
        // Ensure you have a 'thumbnail' conversion defined
        return $this->getFirstMediaUrl('featured_image', 'thumbnail');
    }

    /**
     * Append custom attributes to model serialization.
     *
     * @var array
     */
    protected $appends = [
        'original_featured_image_url',
        'thumbnail_featured_image_url'
    ];
    /**
     * Scope a query to only include published items.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                     ->where(function ($q) {
                         // Ensure publish_date is null or in the past
                         $q->whereNull('publish_date')
                           ->orWhere('publish_date', '<=', now());
                     });
    }

}
