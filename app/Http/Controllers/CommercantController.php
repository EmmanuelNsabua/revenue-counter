<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommercantRequest;
use App\Models\Commercant;
use App\Services\CommercantService;
use Illuminate\Http\Request;

class CommercantController extends Controller
{
    protected CommercantService $commercantService;

    public function __construct(CommercantService $commercantService)
    {
        $this->commercantService = $commercantService;
    }

    public function index(Request $request)
    {
        $query = $request->input('search');
        if ($query) {
            $commercants = $this->commercantService->rechercher($query);
        } else {
            $commercants = Commercant::latest()->get();
        }

        return view('pages.commercant.index', compact('commercants', 'query'));
    }

    public function create()
    {
        $this->authorize('create', Commercant::class);
        return view('pages.commercant.create');
    }

    public function store(StoreCommercantRequest $request)
    {
        $this->authorize('create', Commercant::class);
        
        $commercant = $this->commercantService->enregistrer($request->validated());

        return redirect()->route('commercant.index')
            ->with('success', "Le commerçant {$commercant->nom} a été créé avec succès.");
    }

    public function edit(Commercant $commercant)
    {
        $this->authorize('update', $commercant);
        return view('pages.commercant.edit', compact('commercant'));
    }

    public function update(StoreCommercantRequest $request, Commercant $commercant)
    {
        $this->authorize('update', $commercant);

        $this->commercantService->modifier($commercant->id, $request->validated());

        return redirect()->route('commercant.index')
            ->with('success', "Les informations de {$commercant->nom} ont été mises à jour.");
    }
}
