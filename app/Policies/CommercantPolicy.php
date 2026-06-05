<?php

namespace App\Policies;

use App\Models\Agent;
use App\Models\Commercant;

class CommercantPolicy
{
    public function viewAny(Agent $user): bool
    {
        return true;
    }

    public function view(Agent $user, Commercant $commercant): bool
    {
        return true;
    }

    public function create(Agent $user): bool
    {
        return $user->isAdmin() || $user->isSuperAdmin();
    }

    public function update(Agent $user, Commercant $commercant): bool
    {
        return $user->isAdmin() || $user->isSuperAdmin();
    }

    public function delete(Agent $user, Commercant $commercant): bool
    {
        return $user->isSuperAdmin();
    }
}
