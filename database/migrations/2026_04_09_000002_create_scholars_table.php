<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scholars', function (Blueprint $table) {
            $table->id();
            $table->json('name');            // translatable
            $table->json('group_name');      // translatable: "الأردن", "اليمن", "الحجاز"
            $table->string('group_key');     // machine-readable: "jordan", "yemen", "hejaz"
            $table->json('bio')->nullable(); // translatable: short credentials
            $table->integer('display_order')->default(0);
            $table->enum('status', ['published', 'draft'])->default('published');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scholars');
    }
};
