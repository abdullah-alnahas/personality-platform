<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("quotes", function (Blueprint $table) {
            $table->id();
            $table->json("text"); // Translatable
            $table->json("source")->nullable(); // Translatable
            $table->boolean("is_featured")->default(false);
            $table->string("status")->default("draft"); // e.g., draft, pending, published
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("quotes");
    }
};
