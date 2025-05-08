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

    // Define which attributes are mass assignable
    protected $fillable = [
        'key',
        'value',
        'type', // Optional: For rendering different input types later
        'group' // Optional: For grouping settings in UI later
    ];

    // Define which attributes are translatable
    public array $translatable = ['value'];

    // Cast the 'value' field (which is JSON in DB) to array/object
    protected $casts = [
        'value' => 'array',
    ];

    // Disable timestamps if your 'settings' table doesn't have created_at/updated_at
    // public $timestamps = false;
}
