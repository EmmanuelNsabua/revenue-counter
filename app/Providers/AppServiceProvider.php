<?php

namespace App\Providers;

use App\Models\Agent;
use App\Models\Commercant;
use App\Models\Paiement;
use App\Models\Recu;
use App\Models\Taxe;
use App\Observers\AuditObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Centralized Audit Logging via Observer
        Agent::observe(AuditObserver::class);
        Commercant::observe(AuditObserver::class);
        Paiement::observe(AuditObserver::class);
        Recu::observe(AuditObserver::class);
        Taxe::observe(AuditObserver::class);
    }
}
