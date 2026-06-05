<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Taxe extends Model
{
    protected $fillable = [
        'libelle',
        'montant',
        'frequence',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
    ];

    public function paiements()
    {
        return $this->hasMany(Paiement::class, 'taxe_id');
    }
}
