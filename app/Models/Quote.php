<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations; // Import HasTranslations

class Quote extends Model
{
    use HasFactory, HasTranslations; // Add HasTranslations

    // Define fillable fields based on migration
    protected $fillable = [
        'text',
        'source',
        'is_featured', // Note: This field exists but might not be used if status handles visibility
        'status',
    ];

    // Define translatable fields
    public array $translatable = [
        'text',
        'source',
    ];

    // Define casts, especially for translatable JSON and boolean
    protected $casts = [
        'text' => 'array',
        'source' => 'array',
        'is_featured' => 'boolean',
    ];

    /**
     * Scope a query to only include published quotes.
     * Assumes a 'status' column exists with values like 'published', 'draft'.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePublished($query)
    {
        // Make sure the 'status' column exists in your 'quotes' table migration
        // If not, you might need to add it or adjust this scope.
        return $query->where('status', 'published');
    }
}
