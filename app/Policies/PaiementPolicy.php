<?php

namespace App\Policies;

use App\Models\Agent;
use App\Models\Paiement;

class PaiementPolicy
{
    public function viewAny(Agent $user): bool
    {
        return true;
    }

    public function view(Agent $user, Paiement $paiement): bool
    {
        // Les agents ne peuvent consulter que leurs propres encaissements
        if ($user->role === 'agent') {
            return $paiement->agent_id === $user->id;
        }

        // Les admins/super_admins peuvent tout voir
        return true;
    }

    public function create(Agent $user): bool
    {
        return $user->actif;
    }

    public function update(Agent $user, Paiement $paiement): bool
    {
        // Pour des raisons d'anti-fraude, un paiement validé ne peut jamais être modifié
        return false;
    }

    public function delete(Agent $user, Paiement $paiement): bool
    {
        // Interdiction absolue de supprimer un paiement
        return false;
    }
}
