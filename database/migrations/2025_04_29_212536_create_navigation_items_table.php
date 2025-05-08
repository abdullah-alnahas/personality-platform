<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('navigation_items', function (Blueprint $table) {
            $table->id();
            $table->string('menu_location'); // e.g., 'header', 'footer_col1'
            $table->json('label'); // Translatable
            $table->string('url');
            $table->string('target')->default('_self'); // _self, _blank
            $table->unsignedInteger('order')->default(0);
            $table->foreignId('parent_id')->nullable()->constrained('navigation_items')->onDelete('cascade');
            $table->string('status')->default('published'); // published, draft
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('navigation_items');
    }
};
