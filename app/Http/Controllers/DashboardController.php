<?php

namespace App\Http\Controllers;

use App\Repositories\PaiementRepository;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    protected PaiementRepository $paiementRepository;

    public function __construct(PaiementRepository $paiementRepository)
    {
        $this->paiementRepository = $paiementRepository;
    }

    public function index()
    {
        $user = Auth::user();
        
        // Determiner si on filtre par agent (les agents ne voient que leurs propres chiffres terrain)
        $filterAgentId = ($user->role === 'agent') ? $user->id : null;

        // Calcul des métriques pour le tableau de bord
        $sommeCollectee = $this->paiementRepository->getDailySum($filterAgentId);
        $nombreTransactions = $this->paiementRepository->getDailyCount($filterAgentId);
        $commercantsNonRegle = $this->paiementRepository->getUnpaidCountToday();

        // Récupération des transactions récentes (limite 5)
        if ($filterAgentId) {
            $transactionsRecentes = $this->paiementRepository->getByAgent($user->id)->take(5);
        } else {
            $transactionsRecentes = $this->paiementRepository->getRecent(5);
        }

        return view('pages.dashboard', compact(
            'sommeCollectee',
            'nombreTransactions',
            'commercantsNonRegle',
            'transactionsRecentes'
        ));
    }
}
