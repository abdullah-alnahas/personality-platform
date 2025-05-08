<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class SocialAccount extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'platform',
        'url',
        'account_name', // Added
        'display_order',
        'status',
    ];

    public array $translatable = [
        'account_name', // Make the name translatable
    ];

     protected $casts = [
        'account_name' => 'array', // Cast for easier access if needed
    ];
}
