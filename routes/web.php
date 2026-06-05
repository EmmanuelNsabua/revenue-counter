<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CommercantController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\TaxeController;
use Illuminate\Support\Facades\Route;

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected Routes (requires active agent session)
Route::middleware(['auth'])->group(function () {
    
    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Commerçants Registry
    Route::get('/commercants', [CommercantController::class, 'index'])->name('commercant.index');
    Route::get('/commercants/create', [CommercantController::class, 'create'])->name('commercant.create');
    Route::post('/commercants', [CommercantController::class, 'store'])->name('commercant.store');
    Route::get('/commercants/{commercant}/edit', [CommercantController::class, 'edit'])->name('commercant.edit');
    Route::put('/commercants/{commercant}', [CommercantController::class, 'update'])->name('commercant.update');

    // Payments / Collections
    Route::get('/paiements', [PaiementController::class, 'index'])->name('paiement.index');
    Route::get('/paiements/create', [PaiementController::class, 'create'])->name('paiement.create');
    Route::post('/paiements', [PaiementController::class, 'store'])->name('paiement.store');
    Route::get('/paiements/{id}', [PaiementController::class, 'show'])->name('paiement.show');
    Route::get('/paiements/{id}/recu', [PaiementController::class, 'recu'])->name('paiement.recu');

    // Administration / Taxes Configuration
    Route::get('/admin/taxes', [TaxeController::class, 'index'])->name('admin.taxes');
    Route::post('/admin/taxes', [TaxeController::class, 'store'])->name('admin.taxes.store');
    Route::put('/admin/taxes/{taxe}', [TaxeController::class, 'update'])->name('admin.taxes.update');

    // Sync Offline Endpoint
    Route::post('/api/paiement/sync-offline', [PaiementController::class, 'offlineSync'])->name('api.paiement.sync');
});

// Temporary Route to Migrate Database on Vercel
Route::get('/setup/migrate', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate:fresh', ['--force' => true, '--seed' => true]);
        return 'Base de données migrée et initialisée avec succès. <br>' . nl2br(\Illuminate\Support\Facades\Artisan::output());
    } catch (\Exception $e) {
        return 'Erreur: ' . $e->getMessage() . '<br><pre>' . $e->getTraceAsString() . '</pre>';
    }
});
