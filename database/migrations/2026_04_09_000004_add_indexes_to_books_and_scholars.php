<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->index('status');
            $table->index('display_order');
            $table->index('is_featured');
        });

        Schema::table('scholars', function (Blueprint $table) {
            $table->index('status');
            $table->index('group_key');
            $table->index('display_order');
        });
    }

    public function down(): void
    {
        Schema::table('books', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['display_order']);
            $table->dropIndex(['is_featured']);
        });

        Schema::table('scholars', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['group_key']);
            $table->dropIndex(['display_order']);
        });
    }
};
