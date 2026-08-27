<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('invoiceNumber')->unique();
            $table->json('company');
            $table->json('customer');
            $table->json('meta');
            $table->json('items');
            $table->json('summary');
            $table->string('status')->default('Draft');
            $table->string('createdAt')->nullable();
            $table->string('updatedAt')->nullable();
            $table->string('created_at')->nullable();
            $table->string('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
