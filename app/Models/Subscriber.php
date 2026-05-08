<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscriber extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
    ];

    /**
     * Email NOT encrypted at rest because the column carries a UNIQUE
     * constraint and Laravel's `encrypted` cast emits non-deterministic
     * ciphertext (random IV per write). Encrypting would require splitting
     * into `email_ciphertext` (TEXT) + `email_hash` (UNIQUE sha256+APP_KEY)
     * and rewriting the duplicate-detection / lookup paths. Acceptable risk
     * given subscriber emails are low-sensitivity (newsletter list) and the
     * DB user is already least-privilege per docs/deployment-cpanel.md.
     */
    protected $casts = [
        'confirmed_at' => 'datetime',
    ];
}
