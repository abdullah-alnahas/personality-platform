<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->json('title');
            $table->string('slug')->unique();
            $table->string('status')->default('draft');
            $table->json('meta_fields')->nullable();
            $table->boolean('is_homepage')->default(false);
            $table->string('layout')->default('default');
            $table->timestamps();

            $table->index('status');
            $table->index('is_homepage');
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
