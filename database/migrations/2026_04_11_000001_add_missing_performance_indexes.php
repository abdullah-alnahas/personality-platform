<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Foreign key indexes (needed for JOIN performance and referential integrity checks)
        Schema::table('content_items', function (Blueprint $table) {
            if (!$this->hasIndex('content_items', 'content_items_user_id_index')) {
                $table->index('user_id');
            }
        });

        // Status indexes for scope queries (scopePublished, scopeActive)
        Schema::table('content_items', function (Blueprint $table) {
            if (!$this->hasIndex('content_items', 'content_items_status_index')) {
                $table->index('status');
            }
        });

        Schema::table('content_categories', function (Blueprint $table) {
            if (!$this->hasIndex('content_categories', 'content_categories_status_index')) {
                $table->index('status');
            }
        });

        Schema::table('quotes', function (Blueprint $table) {
            if (!$this->hasIndex('quotes', 'quotes_status_index')) {
                $table->index('status');
            }
        });

        Schema::table('navigation_items', function (Blueprint $table) {
            if (!$this->hasIndex('navigation_items', 'navigation_items_menu_location_index')) {
                $table->index('menu_location');
            }
        });
    }

    public function down(): void
    {
        Schema::table('content_items', function (Blueprint $table) {
            $table->dropIndexIfExists('content_items_user_id_index');
            $table->dropIndexIfExists('content_items_status_index');
        });

        Schema::table('content_categories', function (Blueprint $table) {
            $table->dropIndexIfExists('content_categories_status_index');
        });

        Schema::table('quotes', function (Blueprint $table) {
            $table->dropIndexIfExists('quotes_status_index');
        });

        Schema::table('navigation_items', function (Blueprint $table) {
            $table->dropIndexIfExists('navigation_items_menu_location_index');
        });
    }

    private function hasIndex(string $table, string $index): bool
    {
        return collect(\Illuminate\Support\Facades\DB::select("SHOW INDEX FROM `{$table}`"))
            ->pluck('Key_name')
            ->contains($index);
    }
};
