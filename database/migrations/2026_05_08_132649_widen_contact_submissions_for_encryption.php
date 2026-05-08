<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Widen contact_submissions.name and .email to TEXT so they can hold
     * Laravel's encrypted-cast output (base64 blob, ~1.4× source length plus
     * IV + HMAC envelope). VARCHAR(255) is too tight in the worst case for
     * encrypted long names.
     */
    public function up(): void
    {
        Schema::table('contact_submissions', function (Blueprint $table) {
            $table->text('name')->change();
            $table->text('email')->change();
        });
    }

    public function down(): void
    {
        Schema::table('contact_submissions', function (Blueprint $table) {
            $table->string('name')->change();
            $table->string('email')->change();
        });
    }
};
