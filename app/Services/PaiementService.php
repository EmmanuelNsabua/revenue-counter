<?php

namespace App\Services;

use App\Models\Paiement;
use App\Repositories\PaiementRepository;
use App\Repositories\TaxeRepository;
use App\Services\Payment\PaymentStrategyFactory;
use Illuminate\Support\Facades\DB;

class PaiementService
{
    protected PaiementRepository $paiementRepository;
    protected TaxeRepository $taxeRepository;
    protected PaymentStrategyFactory $paymentFactory;

    public function __construct(
        PaiementRepository $paiementRepository,
        TaxeRepository $taxeRepository,
        PaymentStrategyFactory $paymentFactory
    ) {
        $this->paiementRepository = $paiementRepository;
        $this->taxeRepository = $taxeRepository;
        $this->paymentFactory = $paymentFactory;
    }

    /**
     * Enregistrer un paiement dans la base de données.
     *
     * @param array $data
     * @return Paiement
     * @throws \Exception
     */
    public function enregistrer(array $data): Paiement
    {
        // 1. Validation de la règle métier anti-doublon (déjà payé aujourd'hui)
        if ($this->paiementRepository->hasPaidToday($data['commercant_id'], $data['taxe_id'])) {
            throw new \Exception("Ce commerçant a déjà payé cette taxe aujourd'hui.");
        }

        // 2. Recherche du montant standard de la taxe si non spécifié
        if (empty($data['montant'])) {
            $taxe = $this->taxeRepository->find($data['taxe_id']);
            if (!$taxe) {
                throw new \Exception("Taxe spécifiée introuvable.");
            }
            $data['montant'] = $taxe->montant;
        }

        // 3. Pré-configuration des métadonnées de transaction
        $data['reference'] = 'REF-' . strtoupper(uniqid());
        $data['date_paiement'] = now();
        $data['statut'] = 'en_attente';

        // 4. Exécution du flux dans une transaction pour cohérence ACIDE
        return DB::transaction(function () use ($data) {
            // Création de l'enregistrement de paiement (déclenche l'AuditObserver pour trace AuditLog)
            $paiement = $this->paiementRepository->create($data);

            // 5. Résolution de la stratégie de paiement (Cash, Mobile money, etc.)
            $strategy = $this->paymentFactory->make($data['mode_paiement']);
            $result = $strategy->process($paiement);

            // 6. Mise à jour de l'état final suite au traitement
            $paiement->update([
                'statut' => $result['statut'],
                'reference' => $result['reference'] ?? $paiement->reference
            ]);

            // 7. Génération automatique du reçu pour les paiements validés
            if ($result['statut'] === 'valide') {
                $paiement->recu()->create([
                    'numero' => 'REC-' . date('Ymd') . '-' . str_pad($paiement->id, 5, '0', STR_PAD_LEFT),
                    'date_emission' => now(),
                    'url' => route('paiement.recu', ['id' => $paiement->id])
                ]);
            }

            return $paiement;
        });
    }
}
