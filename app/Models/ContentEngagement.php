<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentEngagement extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'content_type',
        'content_id',
        'engagement_type',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'content_id' => 'integer',
        'created_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (ContentEngagement $engagement) {
            $engagement->created_at = $engagement->created_at ?? now();
        });
    }
}
