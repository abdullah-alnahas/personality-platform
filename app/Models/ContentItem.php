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
        // Conversions will be defined in registerMediaConversions
    }

    // This model-level method defines conversions for all media in this model,
    // or you can define them per-collection in registerMediaCollections if preferred.
    public function registerMediaConversions(SpatieMedia $media = null): void
    {
        // Thumbnail
        $this->addMediaConversion("thumbnail")
            ->width(150)
            ->height(150)
            ->sharpen(10)
            ->format("webp") // Attempt to create a WebP version
            ->performOnCollections("featured_image");
        $this->addMediaConversion("thumbnail_jpg") // Fallback JPG thumbnail
            ->width(150)
            ->height(150)
            ->sharpen(10)
            ->format("jpg")
            ->performOnCollections("featured_image");

        // Small responsive size
        $this->addMediaConversion("responsive_sm")
            ->width(320)
            ->format("webp") // Attempt to create a WebP version
            ->performOnCollections("featured_image");
        $this->addMediaConversion("responsive_sm_jpg") // Fallback JPG
            ->width(320)
            ->format("jpg")
            ->performOnCollections("featured_image");

        // Medium responsive size
        $this->addMediaConversion("responsive_md")
            ->width(768)
            ->format("webp") // Attempt to create a WebP version
            ->performOnCollections("featured_image");
        $this->addMediaConversion("responsive_md_jpg") // Fallback JPG
            ->width(768)
            ->format("jpg")
            ->performOnCollections("featured_image");

        // Large responsive size (example)
        $this->addMediaConversion("responsive_lg")
            ->width(1200)
            ->format("webp") // Attempt to create a WebP version
            ->performOnCollections("featured_image");
        $this->addMediaConversion("responsive_lg_jpg") // Fallback JPG
            ->width(1200)
            ->format("jpg")
            ->performOnCollections("featured_image");

        // Optionally, you can add ->nonQueued() to conversions if they must be immediate,
        // but queuing is generally better for performance during uploads.
    }

    public function getOriginalFeaturedImageUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl("featured_image");
    }

    // This specific accessor for thumbnail_featured_image_url might need adjustment
    // if we now have multiple thumbnail formats (webp, jpg).
    // The frontend will need to be smarter about choosing.
    // For simplicity, let's keep it pointing to the original thumbnail logic (getFirstUrl usually prefers original or first conversion)
    // or decide on a primary thumbnail format.
    public function getThumbnailFeaturedImageUrlAttribute(): ?string
    {
        // Prefer WebP thumbnail if available, otherwise fallback to JPG thumbnail
        if ($this->hasMedia("featured_image")) {
            $media = $this->getFirstMedia("featured_image");
            if ($media->hasGeneratedConversion("thumbnail")) {
                // WebP version
                return $media->getUrl("thumbnail");
            }
            if ($media->hasGeneratedConversion("thumbnail_jpg")) {
                // JPG fallback
                return $media->getUrl("thumbnail_jpg");
            }
        }
        return $this->getFirstMediaUrl("featured_image", "thumbnail_jpg"); // Fallback if no specific found
    }

    protected $appends = [
        "original_featured_image_url",
        "thumbnail_featured_image_url",
        // We will add more specific URLs for srcset in the controller/resource if needed
        // or the frontend will construct them using getUrl for each conversion.
    ];

    public function scopePublished($query)
    {
        return $query->where("status", "published")->where(function ($q) {
            $q->whereNull("publish_date")->orWhere("publish_date", "<=", now());
        });
    }
}
