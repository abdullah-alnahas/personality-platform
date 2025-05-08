<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('content_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_category_id')->constrained('content_categories')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->comment('Author')->constrained('users')->nullOnDelete();
            $table->json('title'); // Translatable
            $table->string('slug')->unique();
            $table->json('content')->nullable(); // Translatable (long text/HTML)
            $table->json('excerpt')->nullable(); // Translatable (short summary)
            $table->string('status')->default('published'); // published, draft, pending
            $table->timestamp('publish_date')->nullable()->index();
            $table->json('meta_fields')->nullable(); // Translatable (e.g., SEO meta, Open Graph)
            $table->boolean('is_featured_home')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_items');
    }
};
