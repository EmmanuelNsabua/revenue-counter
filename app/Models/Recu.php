<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recu extends Model
{
    protected $fillable = [
        'numero',
        'date_emission',
        'url',
        'paiement_id',
    ];

    protected $casts = [
        'date_emission' => 'datetime',
    ];

    public function paiement()
    {
        return $this->belongsTo(Paiement::class, 'paiement_id');
    }
}
