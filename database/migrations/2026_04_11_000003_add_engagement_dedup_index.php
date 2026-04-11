<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('content_engagements', function (Blueprint $table) {
            $table->index(
                ['content_type', 'content_id', 'engagement_type', 'ip_address', 'created_at'],
                'engagements_dedup_idx'
            );
        });
    }

    public function down(): void
    {
        Schema::table('content_engagements', function (Blueprint $table) {
            $table->dropIndex('engagements_dedup_idx');
        });
    }
};
