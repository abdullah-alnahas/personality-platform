<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('social_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('platform'); // facebook, instagram, youtube, telegram, x, etc.
            $table->string('url');
            $table->json('account_name')->nullable(); // Translatable (e.g., "Personal", "Institute", "Project X")
            $table->unsignedInteger('display_order')->default(0);
            $table->string('status')->default('active'); // active, inactive
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('social_accounts');
    }
};
