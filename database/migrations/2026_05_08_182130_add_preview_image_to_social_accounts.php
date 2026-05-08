<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('social_accounts', function (Blueprint $table) {
            $table->string('preview_image_url', 1024)->nullable()->after('account_name');
            $table->text('preview_caption')->nullable()->after('preview_image_url');
        });
    }

    public function down(): void
    {
        Schema::table('social_accounts', function (Blueprint $table) {
            $table->dropColumn(['preview_image_url', 'preview_caption']);
        });
    }
};
