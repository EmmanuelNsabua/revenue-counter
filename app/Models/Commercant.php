<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commercant extends Model
{
    protected $fillable = [
        'nom',
        'numero_document',
        'type_activite',
        'emplacement',
        'actif',
    ];

    protected $casts = [
        'actif' => 'boolean',
    ];

    public function paiements()
    {
        return $this->hasMany(Paiement::class, 'commercant_id');
    }
}
