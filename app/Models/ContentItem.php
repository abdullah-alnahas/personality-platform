<?php namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Translatable\HasTranslations;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia; // Alias to avoid confusion if needed, or use FQCN

class ContentItem extends Model implements HasMedia
{
    use HasFactory, HasTranslations, HasSlug, SoftDeletes, InteractsWithMedia;

    protected $fillable = [
        "content_category_id",
        "user_id", // Author
        "title",
        "slug",
        "content",
        "excerpt",
        "status",
        "publish_date",
        "meta_fields",
        "is_featured_home",
    ];

    public array $translatable = ["title", "content", "excerpt", "meta_fields"];

    protected $casts = [
        "title" => "array",
        "content" => "array",
        "excerpt" => "array",
        "meta_fields" => "array",
        "publish_date" => "datetime",
        "is_featured_home" => "boolean",
    ];

    public function setContentAttribute($value)
    {
        if (is_array($value)) {
            $cleanedTranslations = [];
            foreach ($value as $locale => $htmlContent) {
                // Cleanse only if it's a non-null string
                $cleanedTranslations[$locale] = is_string($htmlContent)
                    ? clean($htmlContent)
                    : $htmlContent;
            }
            $this->attributes["content"] = json_encode($cleanedTranslations);
        } elseif (is_string($value)) {
            // This case should ideally not happen if form sends structured translations
            // but as a fallback, clean it and set for the current locale.
            // For safety, ensure it's stored in the JSON structure.
            $locale = app()->getLocale();
            $this->attributes["content"] = json_encode([
                $locale => clean($value),
            ]);
        } else {
            $this->attributes["content"] = $value; // Or json_encode($value) if it should always be JSON
        }
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom("title")
            ->saveSlugsTo("slug")
            ->doNotGenerateSlugsOnUpdate();
    }

    public function category()
    {
        return $this->belongsTo(ContentCategory::class, "content_category_id");
    }

    public function author()
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection("featured_image")
            ->singleFile()
            ->useDisk("public")
            // The registerMediaConversions method on the *collection* object takes a closure.
            // The type hint for $media in this closure must be Spatie's Media class.
            ->registerMediaConversions(function (SpatieMedia $media = null) {
                // Use aliased or FQCN
                $this->addMediaConversion("thumbnail")
                    ->width(150)
                    ->height(150)
                    ->sharpen(10);
            });
        // If you have ->withResponsiveImages(), that should come before ->registerMediaConversions
        // Example:
        // $this->addMediaCollection('featured_image')
        //    ->singleFile()
        //    ->useDisk('public')
        //    ->withResponsiveImages() // If you use this, ensure necessary libraries like GD/Imagick are set up
        //    ->registerMediaConversions(function (SpatieMedia $media = null) { ... });
    }

    // This is a separate model-level method, also called by the Spatie package,
    // IF you want to define conversions globally for all collections on this model,
    // or if you don't define them per-collection.
    // If you define them per collection (as above), this might not be strictly necessary
    // unless you have other collections or want global fallbacks.
    // For clarity, let's ensure it's also correctly type-hinted if present.
    /*
    public function registerMediaConversions(SpatieMedia $media = null): void
    {
        $this->addMediaConversion('thumbnail') // This would be a global "thumbnail"
              ->width(150)
              ->height(150)
              ->sharpen(10);
    }
    */

    public function getOriginalFeaturedImageUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl("featured_image");
    }

    public function getThumbnailFeaturedImageUrlAttribute(): ?string
    {
        // Ensure 'thumbnail' conversion is defined in registerMediaConversions for the 'featured_image' collection
        return $this->getFirstMediaUrl("featured_image", "thumbnail");
    }

    protected $appends = [
        "original_featured_image_url",
        "thumbnail_featured_image_url",
    ];

    public function scopePublished($query)
    {
        return $query->where("status", "published")->where(function ($q) {
            $q->whereNull("publish_date")->orWhere("publish_date", "<=", now());
        });
    }
}
