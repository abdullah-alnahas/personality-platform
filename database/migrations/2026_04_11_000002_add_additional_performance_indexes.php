<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // parent_id index on navigation_items for hierarchical queries
        Schema::table('navigation_items', function (Blueprint $table) {
            if (!$this->hasIndex('navigation_items', 'navigation_items_parent_id_index')) {
                $table->index('parent_id');
            }
        });

        // Composite (status, publish_date) index on content_items for the most common query:
        // WHERE status='published' ORDER BY publish_date DESC
        Schema::table('content_items', function (Blueprint $table) {
            if (!$this->hasIndex('content_items', 'content_items_status_publish_date_index')) {
                $table->index(['status', 'publish_date'], 'content_items_status_publish_date_index');
            }
        });
    }

    public function down(): void
    {
        Schema::table('navigation_items', function (Blueprint $table) {
            $table->dropIndexIfExists('navigation_items_parent_id_index');
        });

        Schema::table('content_items', function (Blueprint $table) {
            $table->dropIndexIfExists('content_items_status_publish_date_index');
        });
    }

    private function hasIndex(string $table, string $index): bool
    {
        return collect(DB::select("SHOW INDEX FROM `{$table}`"))
            ->pluck('Key_name')
            ->contains($index);
    }
};
