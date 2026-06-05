<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaxeRequest;
use App\Models\Taxe;
use App\Services\TaxeService;

class TaxeController extends Controller
{
    protected TaxeService $taxeService;

    public function __construct(TaxeService $taxeService)
    {
        $this->taxeService = $taxeService;
    }

    public function index()
    {
        $this->authorize('viewAny', Taxe::class);
        $taxes = $this->taxeService->obtenirToutes();
        return view('pages.admin.taxes', compact('taxes'));
    }

    public function store(StoreTaxeRequest $request)
    {
        $this->authorize('create', Taxe::class);
        
        $this->taxeService->enregistrer($request->validated());

        return redirect()->route('admin.taxes')
            ->with('success', 'Nouveau type de taxe enregistré.');
    }

    public function update(StoreTaxeRequest $request, Taxe $taxe)
    {
        $this->authorize('update', $taxe);

        $this->taxeService->modifier($taxe->id, $request->validated());

        return redirect()->route('admin.taxes')
            ->with('success', 'Paramétrage de la taxe mis à jour.');
    }
}
