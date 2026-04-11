<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Setting extends Model
{
    use HasFactory, HasTranslations;

    protected $primaryKey = 'key'; // Setting 'key' as the primary key
    public $incrementing = false;   // Primary key is not auto-incrementing
    protected $keyType = 'string';  // Primary key is a string

    protected $fillable = ['key', 'value', 'type', 'group'];

    // Define which attributes are translatable
    public array $translatable = ['value'];

    protected $casts = [
        // 'value' is handled by HasTranslations — no separate array cast needed
    ];

    // Disable timestamps if your 'settings' table doesn't have created_at/updated_at
    // public $timestamps = false;
}
