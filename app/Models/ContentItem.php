<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder; // For scope type hinting
use Illuminate\Support\Carbon; // For date type hinting
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Translatable\HasTranslations;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\MediaLibrary\MediaCollections\Models\Media as SpatieMedia;

/**
 * App\Models\ContentItem
 *
 * Represents a piece of content within the platform, such as an article,
 * news item, or educational material. It supports translations,
 * media attachments (featured image), and categorization.
 *
 * @property int $id
 * @property int $content_category_id Foreign key for ContentCategory.
 * @property int|null $user_id Foreign key for User (author).
 * @property array $title Translatable title of the content item.
 * @property string $slug Unique slug generated from the title.
 * @property array|null $content Translatable main content (HTML or text).
 * @property array|null $excerpt Translatable short summary.
 * @property array|null $featured_image_alt_text Translatable alt text for the featured image.
 * @property string $status Publication status (e.g., 'published', 'draft', 'pending').
 * @property Carbon|null $publish_date Date and time when the content should be published.
 * @property array|null $meta_fields Translatable meta information (e.g., for SEO).
 * @property bool $is_featured_home Whether the item is featured on the homepage.
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read ContentCategory $category The category this item belongs to.
 * @property-read User|null $author The author of this item.
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection<int, SpatieMedia> $media
 * @property-read string|null $original_featured_image_url URL to the original featured image.
 * @property-read string|null $thumbnail_featured_image_url URL to the thumbnail version of the featured image.
 * @method static \Database\Factories\ContentItemFactory factory($count = null, $state = [])
 * @method static Builder|ContentItem newModelQuery()
 * @method static Builder|ContentItem newQuery()
 * @method static Builder|ContentItem query()
 * @method static Builder|ContentItem published() Scope to get only published items.
 * @mixin \Eloquent
 */
class ContentItem extends Model implements HasMedia
{
    use HasFactory, HasTranslations, HasSlug, SoftDeletes, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        "content_category_id",
        "user_id",
        "title",
        "slug",
        "content",
        "excerpt",
        "featured_image_alt_text",
        "status",
        "publish_date",
        "meta_fields",
        "is_featured_home",
    ];

    /**
     * The attributes that are translatable.
     *
     * @var array<int, string>
     */
    public array $translatable = [
        "title",
        "content",
        "excerpt",
        "meta_fields",
        "featured_image_alt_text",
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        "title" => "array",
        "content" => "array",
        "excerpt" => "array",
        "meta_fields" => "array",
        "featured_image_alt_text" => "array",
        "publish_date" => "datetime",
        "is_featured_home" => "boolean",
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        "original_featured_image_url",
        "thumbnail_featured_image_url",
    ];

    /**
     * Set the content attribute, sanitizing HTML if it's a string or an array of strings.
     *
     * @param string|array|null $value
     * @return void
     */
    public function setContentAttribute($value): void
    {
        if (is_array($value)) {
            $cleanedTranslations = [];
            foreach ($value as $locale => $htmlContent) {
                // Sanitize HTML content using the global 'clean' helper (mews/purifier)
                $cleanedTranslations[$locale] = is_string($htmlContent)
                    ? clean($htmlContent)
                    : $htmlContent;
            }
            $this->attributes["content"] = json_encode($cleanedTranslations);
        } elseif (is_string($value)) {
            // Fallback for non-array value, sanitize and set for current locale
            $locale = app()->getLocale();
            $this->attributes["content"] = json_encode([
                $locale => clean($value),
            ]);
        } else {
            $this->attributes["content"] = $value; // Store as is if not string or array (e.g., null)
        }
    }

    /**
     * Get the options for generating the slug.
     *
     * @return SlugOptions
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom("title") // Generate slug from the 'title' attribute
            ->saveSlugsTo("slug") // Save it to the 'slug' attribute
            ->doNotGenerateSlugsOnUpdate(); // Do not update slug automatically when title changes
    }

    /**
     * Get the category that this content item belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<ContentCategory, ContentItem>
     */
    public function category()
    {
        return $this->belongsTo(ContentCategory::class, "content_category_id");
    }

    /**
     * Get the author (user) of this content item.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<User, ContentItem>
     */
    public function author()
    {
        return $this->belongsTo(User::class, "user_id");
    }

    /**
     * Register media collections for this model.
     * Defines the 'featured_image' collection as a single file stored on the 'public' disk.
     *
     * @return void
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection("featured_image")
            ->singleFile()
            ->useDisk("public");
    }

    /**
     * Register media conversions for this model.
     * This method is called when media is added or updated.
     *
     * @param SpatieMedia|null $media The media instance, can be null.
     * @return void
     */
    public function registerMediaConversions(SpatieMedia $media = null): void
    {
        // Thumbnail conversions (WebP and JPG fallback)
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

        // Small responsive size conversions
        $this->addMediaConversion("responsive_sm")
            ->width(320)
            ->format("webp")
            ->performOnCollections("featured_image");
        $this->addMediaConversion("responsive_sm_jpg")
            ->width(320)
            ->format("jpg")
            ->performOnCollections("featured_image");

        // Medium responsive size conversions
        $this->addMediaConversion("responsive_md")
            ->width(768)
            ->format("webp")
            ->performOnCollections("featured_image");
        $this->addMediaConversion("responsive_md_jpg")
            ->width(768)
            ->format("jpg")
            ->performOnCollections("featured_image");

        // Large responsive size conversions
        $this->addMediaConversion("responsive_lg")
            ->width(1200)
            ->format("webp")
            ->performOnCollections("featured_image");
        $this->addMediaConversion("responsive_lg_jpg")
            ->width(1200)
            ->format("jpg")
            ->performOnCollections("featured_image");
    }

    /**
     * Get the URL of the original featured image.
     * Accessor for $appends.
     *
     * @return string|null
     */
    public function getOriginalFeaturedImageUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl("featured_image");
    }

    /**
     * Get the URL of the thumbnail featured image, preferring WebP.
     * Accessor for $appends.
     *
     * @return string|null
     */
    public function getThumbnailFeaturedImageUrlAttribute(): ?string
    {
        if ($this->hasMedia("featured_image")) {
            $media = $this->getFirstMedia("featured_image");
            if ($media && $media->hasGeneratedConversion("thumbnail")) {
                // WebP version
                return $media->getUrl("thumbnail");
            }
            if ($media && $media->hasGeneratedConversion("thumbnail_jpg")) {
                // JPG fallback
                return $media->getUrl("thumbnail_jpg");
            }
            // If no specific thumbnail conversions, return original (or what getFirstMediaUrl provides)
            return $this->getFirstMediaUrl("featured_image");
        }
        return null;
    }

    /**
     * Scope a query to only include published content items.
     * Published items have 'published' status and their publish_date is null or in the past.
     *
     * @param Builder<ContentItem> $query
     * @return Builder<ContentItem>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where("status", "published")
            ->where(function (Builder $q) {
                $q->whereNull("publish_date")->orWhere(
                    "publish_date",
                    "<=",
                    Carbon::now()
                );
            });
    }
}
