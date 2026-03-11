<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->timestamp('scheduled_at')->nullable()->after('status');
        });

        Schema::table('page_blocks', function (Blueprint $table) {
            $table->timestamp('scheduled_at')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn('scheduled_at');
        });

        Schema::table('page_blocks', function (Blueprint $table) {
            $table->dropColumn('scheduled_at');
        });
    }
};
