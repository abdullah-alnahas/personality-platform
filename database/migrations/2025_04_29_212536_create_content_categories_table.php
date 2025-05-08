<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_categories', function (Blueprint $table) {
            $table->id();
            $table->json('name'); // Translatable
            $table->string('slug')->unique();
            $table->json('description')->nullable(); // Translatable
            $table->json('quote')->nullable(); // Translatable
            $table->string('icon')->nullable(); // e.g., MUI icon name or path
            $table->string('image')->nullable(); // Associated image path (handled via medialibrary later maybe)
            $table->unsignedInteger('order')->default(0);
            $table->string('status')->default('published'); // published, draft
            $table->json('meta_fields')->nullable(); // Translatable (e.g., SEO title, description)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_categories');
    }
};
