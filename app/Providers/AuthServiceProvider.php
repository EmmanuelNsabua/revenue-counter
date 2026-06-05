<?php

namespace App\Providers;

use App\Models\Commercant;
use App\Models\Paiement;
use App\Models\Taxe;
use App\Policies\CommercantPolicy;
use App\Policies\PaiementPolicy;
use App\Policies\TaxePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Paiement::class => PaiementPolicy::class,
        Commercant::class => CommercantPolicy::class,
        Taxe::class => TaxePolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
