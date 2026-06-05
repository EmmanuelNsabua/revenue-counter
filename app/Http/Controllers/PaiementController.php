<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaiementRequest;
use App\Models\Commercant;
use App\Models\Paiement;
use App\Models\Taxe;
use App\Repositories\PaiementRepository;
use App\Services\PaiementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaiementController extends Controller
{
    protected PaiementService $paiementService;
    protected PaiementRepository $paiementRepository;

    public function __construct(PaiementService $paiementService, PaiementRepository $paiementRepository)
    {
        $this->paiementService = $paiementService;
        $this->paiementRepository = $paiementRepository;
    }

    public function index()
    {
        $user = Auth::user();
        if ($user->role === 'agent') {
            $paiements = $this->paiementRepository->getByAgent($user->id);
        } else {
            $paiements = $this->paiementRepository->all();
        }

        return view('pages.paiement.index', compact('paiements'));
    }

    public function create(Request $request)
    {
        $commercantId = $request->query('commercant_id');
        $commercant = $commercantId ? Commercant::find($commercantId) : null;
        
        $commercants = Commercant::where('actif', true)->get();
        $taxes = Taxe::all();

        return view('pages.paiement.create', compact('commercants', 'taxes', 'commercant'));
    }

    public function store(StorePaiementRequest $request)
    {
        $data = $request->validated();
        // Attribue automatiquement l'agent connecté
        $data['agent_id'] = Auth::id();

        try {
            $paiement = $this->paiementService->enregistrer($data);

            return redirect()->route('paiement.show', $paiement->id)
                ->with('success', 'Paiement enregistré et validé avec succès.');
        } catch (\Exception $e) {
            return back()->withInput()->with('error', $e->getMessage());
        }
    }

    public function show($id)
    {
        $paiement = $this->paiementRepository->find($id);
        if (!$paiement) {
            abort(404, 'Transaction introuvable.');
        }

        $this->authorize('view', $paiement);

        return view('pages.paiement.show', compact('paiement'));
    }

    public function recu($id)
    {
        $paiement = $this->paiementRepository->find($id);
        if (!$paiement || !$paiement->recu) {
            abort(404, 'Reçu introuvable.');
        }

        $this->authorize('view', $paiement);

        // Affiche une vue épurée optimisée pour l'impression ou le ticket virtuel
        return view('pages.paiement.recu_ticket', compact('paiement'));
    }

    /**
     * Endpoint API pour synchroniser les paiements saisis hors ligne.
     */
    public function offlineSync(Request $request)
    {
        $payments = $request->input('payments', []);
        $results = [
            'success' => [],
            'errors' => []
        ];

        foreach ($payments as $item) {
            try {
                // Associe l'ID de l'agent authentifié faisant l'appel de synchronisation
                $data = [
                    'commercant_id' => $item['commercant_id'],
                    'taxe_id' => $item['taxe_id'],
                    'montant' => $item['montant'] ?? null,
                    'mode_paiement' => $item['mode_paiement'] ?? 'cash',
                    'agent_id' => Auth::id(),
                ];

                $paiement = $this->paiementService->enregistrer($data);
                
                $results['success'][] = [
                    'local_id' => $item['local_id'] ?? null,
                    'server_id' => $paiement->id,
                    'reference' => $paiement->reference,
                    'numero_recu' => $paiement->recu->numero ?? null
                ];
            } catch (\Exception $e) {
                $results['errors'][] = [
                    'local_id' => $item['local_id'] ?? null,
                    'message' => $e->getMessage()
                ];
            }
        }

        return response()->json([
            'message' => 'Processus de synchronisation terminé.',
            'results' => $results
        ]);
    }
}
