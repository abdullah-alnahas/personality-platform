<?php namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Translatable\HasTranslations;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;

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
        "featured_image_alt_text", // <-- ADDED
        "status",
        "publish_date",
        "meta_fields",
        "is_featured_home",
    ];

    public array $translatable = [
        "title",
        "content",
        "excerpt",
        "meta_fields",
        "featured_image_alt_text", // <-- ADDED
    ];

    protected $casts = [
        "title" => "array",
        "content" => "array",
        "excerpt" => "array",
        "meta_fields" => "array",
        "featured_image_alt_text" => "array", // <-- ADDED
        "publish_date" => "datetime",
        "is_featured_home" => "boolean",
    ];

    // ... (setContentAttribute, getSlugOptions, relationships, registerMediaCollections, registerMediaConversions remain the same) ...
    public function setContentAttribute($value)
    {
        if (is_array($value)) {
            $cleanedTranslations = [];
            foreach ($value as $locale => $htmlContent) {
                $cleanedTranslations[$locale] = is_string($htmlContent)
                    ? clean($htmlContent) // Assumes mews/purifier's clean() helper
                    : $htmlContent;
            }
            $this->attributes["content"] = json_encode($cleanedTranslations);
        } elseif (is_string($value)) {
            $locale = app()->getLocale();
            $this->attributes["content"] = json_encode([
                $locale => clean($value),
            ]);
        } else {
            $this->attributes["content"] = $value;
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
            ->useDisk("public");
    }

    public function registerMediaConversions(SpatieMedia $media = null): void
    {
        $this->addMediaConversion("thumbnail")
            ->width(150)
            ->height(150)
            ->sharpen(10)
            ->format("webp")
            ->performOnCollections("featured_image");
        $this->addMediaConversion("thumbnail_jpg")
            ->width(150)
            ->height(150)
            ->sharpen(10)
            ->format("jpg")
            ->performOnCollections("featured_image");
        $this->addMediaConversion("responsive_sm")
            ->width(320)
            ->format("webp")
            ->performOnCollections("featured_image");
        $this->addMediaConversion("responsive_sm_jpg")
            ->width(320)
            ->format("jpg")
            ->performOnCollections("featured_image");
        $this->addMediaConversion("responsive_md")
            ->width(768)
            ->format("webp")
            ->performOnCollections("featured_image");
        $this->addMediaConversion("responsive_md_jpg")
            ->width(768)
            ->format("jpg")
            ->performOnCollections("featured_image");
        $this->addMediaConversion("responsive_lg")
            ->width(1200)
            ->format("webp")
            ->performOnCollections("featured_image");
        $this->addMediaConversion("responsive_lg_jpg")
            ->width(1200)
            ->format("jpg")
            ->performOnCollections("featured_image");
    }

    public function getOriginalFeaturedImageUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl("featured_image");
    }

    public function getThumbnailFeaturedImageUrlAttribute(): ?string
    {
        if ($this->hasMedia("featured_image")) {
            $media = $this->getFirstMedia("featured_image");
            if ($media->hasGeneratedConversion("thumbnail")) {
                return $media->getUrl("thumbnail");
            }
            if ($media->hasGeneratedConversion("thumbnail_jpg")) {
                return $media->getUrl("thumbnail_jpg");
            }
        }
        return $this->getFirstMediaUrl("featured_image", "thumbnail_jpg");
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
