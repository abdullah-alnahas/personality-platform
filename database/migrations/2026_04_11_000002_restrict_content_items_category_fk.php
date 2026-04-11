<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Changes the content_items.content_category_id foreign key from CASCADE to RESTRICT.
 *
 * Prevents silent data loss: deleting a category that still has items will now
 * raise a DB-level error instead of silently deleting all child content.
 * The application layer (ContentCategoryController) also guards against this,
 * so the DB constraint acts as a safety net.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('content_items', function (Blueprint $table) {
            $table->dropForeign(['content_category_id']);
            $table->foreign('content_category_id')
                ->references('id')
                ->on('content_categories')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('content_items', function (Blueprint $table) {
            $table->dropForeign(['content_category_id']);
            $table->foreign('content_category_id')
                ->references('id')
                ->on('content_categories')
                ->cascadeOnDelete();
        });
    }
};
