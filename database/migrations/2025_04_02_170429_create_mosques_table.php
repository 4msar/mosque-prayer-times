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
        Schema::create('mosques', function (Blueprint $table) {
            $table->id();
            $table->string('place_id', 255)->unique();
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('map_url', 255)->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();

            // Prayer times
            $table->string('fajr')->nullable();
            $table->string('dhuhr')->nullable();
            $table->string('asr')->nullable();
            $table->string('maghrib')->nullable();
            $table->string('isha')->nullable();
            $table->string('sunrise')->nullable();
            $table->string('sunset')->nullable();
            $table->string('jummah')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mosques');
    }
};
