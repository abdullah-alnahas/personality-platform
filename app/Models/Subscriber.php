<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscriber extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'token',
        'confirmed_at',
        'status',
    ];

    protected $casts = [
        'confirmed_at' => 'datetime',
    ];
}
