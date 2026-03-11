<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cache_dependencies', function (Blueprint $table) {
            $table->id();
            $table->string('cache_key')->index();
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');
            $table->timestamp('created_at')->nullable();

            $table->index(['model_type', 'model_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cache_dependencies');
    }
};
