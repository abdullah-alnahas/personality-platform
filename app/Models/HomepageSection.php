<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class HomepageSection extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'section_type', // e.g., 'vision', 'thematic_carousel', 'latest_news', 'featured_quote', 'social_media_links'
        'title',        // Translatable JSON
        'subtitle_or_quote', // Translatable JSON (can be used for vision text or section quote)
        'content_category_id', // FK to ContentCategory (for thematic sections)
        'max_items',    // Max items to show in a list/carousel
        'display_order',
        'status',       // 'published', 'draft'
        'config',       // JSON for extra type-specific configurations if needed
    ];

    public array $translatable = [
        'title',
        'subtitle_or_quote',
    ];

    protected $casts = [
        'title' => 'array',
        'subtitle_or_quote' => 'array',
        'max_items' => 'integer',
        'display_order' => 'integer',
        'config' => 'array',
    ];

    /**
     * Relationship to ContentCategory (optional).
     */
    public function contentCategory()
    {
        return $this->belongsTo(ContentCategory::class);
    }

    /**
     * Scope a query to only include published sections.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
