<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('homepage_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_type')->index(); // e.g., 'vision', 'thematic_carousel', 'latest_news', etc.
            $table->json('title')->nullable(); // Translatable
            $table->json('subtitle_or_quote')->nullable(); // Translatable
            $table->foreignId('content_category_id')->nullable()->constrained('content_categories')->nullOnDelete();
            $table->unsignedInteger('max_items')->nullable()->default(5);
            $table->unsignedInteger('display_order')->default(0);
            $table->string('status')->default('published')->index(); // 'published', 'draft'
            $table->json('config')->nullable(); // For extra section-specific settings
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('homepage_sections');
    }
};
