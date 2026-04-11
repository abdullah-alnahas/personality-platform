<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Book extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'cover_image_url',
        'buy_link',
        'category',
        'display_order',
        'is_featured',
        'status',
    ];

    public array $translatable = ['title', 'subtitle', 'description'];

    protected $casts = [
        'is_featured' => 'boolean',
    ];

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }
}
