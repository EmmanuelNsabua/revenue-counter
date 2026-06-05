<?php

namespace App\Repositories;

use App\Models\Paiement;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class PaiementRepository
{
    public function find(int $id): ?Paiement
    {
        return Paiement::with(['agent', 'commercant', 'taxe', 'recu'])->find($id);
    }

    public function all(): Collection
    {
        return Paiement::with(['agent', 'commercant', 'taxe'])->latest()->get();
    }

    public function getRecent(int $limit = 10): Collection
    {
        return Paiement::with(['commercant', 'taxe'])
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getByAgent(int $agentId): Collection
    {
        return Paiement::with(['commercant', 'taxe'])
            ->where('agent_id', $agentId)
            ->latest()
            ->get();
    }

    public function hasPaidToday(int $commercantId, int $taxeId): bool
    {
        return Paiement::where('commercant_id', $commercantId)
            ->where('taxe_id', $taxeId)
            ->whereDate('date_paiement', Carbon::today())
            ->where('statut', 'valide')
            ->exists();
    }

    public function create(array $data): Paiement
    {
        return Paiement::create($data);
    }

    public function getDailySum(int $agentId = null): float
    {
        $query = Paiement::whereDate('date_paiement', Carbon::today())
            ->where('statut', 'valide');

        if ($agentId) {
            $query->where('agent_id', $agentId);
        }

        return (float) $query->sum('montant');
    }

    public function getDailyCount(int $agentId = null): int
    {
        $query = Paiement::whereDate('date_paiement', Carbon::today())
            ->where('statut', 'valide');

        if ($agentId) {
            $query->where('agent_id', $agentId);
        }

        return $query->count();
    }

    public function getUnpaidCountToday(): int
    {
        // Simple mock ratio for dashboard status
        return max(0, 150 - $this->getDailyCount());
    }
}
