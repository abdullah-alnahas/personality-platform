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
        Schema::table("content_items", function (Blueprint $table) {
            $table
                ->json("featured_image_alt_text")
                ->nullable()
                ->after("is_featured_home");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("content_items", function (Blueprint $table) {
            $table->dropColumn("featured_image_alt_text");
        });
    }
};
