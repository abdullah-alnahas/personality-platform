<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Scholar extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'name',
        'group_name',
        'group_key',
        'bio',
        'photo_url',
        'display_order',
        'status',
    ];

    public array $translatable = ['name', 'group_name', 'bio'];

    protected $casts = [
        'name'       => 'array',
        'group_name' => 'array',
        'bio'        => 'array',
    ];

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
