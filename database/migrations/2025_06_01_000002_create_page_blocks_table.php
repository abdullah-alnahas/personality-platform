<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_blocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->constrained()->cascadeOnDelete();
            $table->string('block_type');
            $table->json('content')->nullable();
            $table->integer('display_order')->default(0);
            $table->string('status')->default('published');
            $table->json('config')->nullable();
            $table->timestamps();

            $table->index(['page_id', 'display_order']);
            $table->index('block_type');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_blocks');
    }
};
