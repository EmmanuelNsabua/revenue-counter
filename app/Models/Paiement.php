<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    protected $fillable = [
        'date_paiement',
        'montant',
        'statut', // valide, refuse, en_attente
        'mode_paiement', // cash, mpesa, airtel, orange
        'reference',
        'agent_id',
        'commercant_id',
        'taxe_id',
    ];

    protected $casts = [
        'date_paiement' => 'datetime',
        'montant' => 'decimal:2',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class, 'agent_id');
    }

    public function commercant()
    {
        return $this->belongsTo(Commercant::class, 'commercant_id');
    }

    public function taxe()
    {
        return $this->belongsTo(Taxe::class, 'taxe_id');
    }

    public function recu()
    {
        return $this->hasOne(Recu::class, 'paiement_id');
    }
}
