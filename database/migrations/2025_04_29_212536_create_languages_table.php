<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('languages', function (Blueprint $table) {
            $table->string('code', 5)->primary(); // e.g., 'en', 'ar', 'tr'
            $table->string('name'); // e.g., 'English', 'Arabic', 'Turkish'
            $table->string('native_name'); // e.g., 'English', 'العربية', 'Türkçe'
            $table->boolean('is_active')->default(true);
            $table->boolean('is_rtl')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('languages');
    }
};
