<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->json('title');           // translatable
            $table->json('subtitle')->nullable();  // translatable
            $table->json('description')->nullable(); // translatable
            $table->string('cover_image_url')->nullable();
            $table->string('buy_link')->nullable();
            $table->string('category')->nullable(); // e.g. "الأسماء", "الحج", etc.
            $table->integer('display_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->enum('status', ['published', 'draft'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
