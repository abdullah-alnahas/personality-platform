<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'message',
        'user_agent',
        'ip_address',
        'status',
    ];

    /**
     * PII fields encrypted at rest. Reading is transparent through the cast.
     * APP_KEY rotation requires re-encrypting rows via a backfill command.
     */
    protected $casts = [
        'name'       => 'encrypted',
        'email'      => 'encrypted',
        'message'    => 'encrypted',
        'user_agent' => 'encrypted',
    ];
}
