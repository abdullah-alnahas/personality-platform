<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class NavigationItem extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'menu_location',
        'label', // Translatable JSON
        'url',
        'target',
        'order',
        'parent_id',
        'status',
    ];

    public array $translatable = [
        'label',
    ];

    protected $casts = [
        'label' => 'array',
        'order' => 'integer',
    ];

    /**
     * Relationship for parent navigation item.
     */
    public function parent()
    {
        return $this->belongsTo(NavigationItem::class, 'parent_id');
    }

    /**
     * Relationship for child navigation items.
     */
    public function children()
    {
        return $this->hasMany(NavigationItem::class, 'parent_id')->orderBy('order');
    }

    /**
     * Scope a query to only include published items.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope a query to only include root items (no parent).
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }
}
