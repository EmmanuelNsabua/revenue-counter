<?php

namespace App\Services\Payment;

use App\Models\Paiement;

class CashPaymentStrategy implements PaymentStrategy
{
    public function process(Paiement $paiement, array $options = []): array
    {
        return [
            'success' => true,
            'reference' => $paiement->reference,
            'statut' => 'valide',
            'message' => 'Paiement en espèces perçu et validé.',
        ];
    }
}
