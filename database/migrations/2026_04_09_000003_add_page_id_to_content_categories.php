<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Link a content category to a rich page-builder page.
     * When set, /category/{slug} will render the linked page instead of the
     * default item-listing template.
     */
    public function up(): void
    {
        Schema::table('content_categories', function (Blueprint $table) {
            $table->foreignId('page_id')
                ->nullable()
                ->constrained('pages')
                ->nullOnDelete()
                ->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('content_categories', function (Blueprint $table) {
            $table->dropForeignIdFor(\App\Models\Page::class);
            $table->dropColumn('page_id');
        });
    }
};
