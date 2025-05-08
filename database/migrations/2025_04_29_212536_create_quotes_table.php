<?php
// Create/Edit file: app/Models/Quote.php

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
        'is_featured',
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
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}