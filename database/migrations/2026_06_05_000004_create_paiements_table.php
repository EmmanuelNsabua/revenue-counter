<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->dateTime('date_paiement');
            $table->decimal('montant', 10, 2);
            $table->string('statut')->default('en_attente'); // valide, refuse, en_attente
            $table->string('mode_paiement')->default('cash'); // cash, mpesa, airtel, orange
            $table->string('reference')->unique();
            $table->foreignId('agent_id')->constrained('agents')->onDelete('cascade');
            $table->foreignId('commercant_id')->constrained('commercants')->onDelete('cascade');
            $table->foreignId('taxe_id')->constrained('taxes')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
