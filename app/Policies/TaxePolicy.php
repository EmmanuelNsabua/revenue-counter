<?php

namespace App\Policies;

use App\Models\Agent;
use App\Models\Taxe;

class TaxePolicy
{
    public function viewAny(Agent $user): bool
    {
        return $user->isAdmin() || $user->isSuperAdmin();
    }

    public function view(Agent $user, Taxe $taxe): bool
    {
        return $user->isAdmin() || $user->isSuperAdmin();
    }

    public function create(Agent $user): bool
    {
        return $user->isAdmin() || $user->isSuperAdmin();
    }

    public function update(Agent $user, Taxe $taxe): bool
    {
        return $user->isAdmin() || $user->isSuperAdmin();
    }

    public function delete(Agent $user, Taxe $taxe): bool
    {
        return $user->isSuperAdmin();
    }
}
