<?php

namespace App\Services\Payment;

use App\Models\Paiement;

class AirtelPaymentStrategy implements PaymentStrategy
{
    public function process(Paiement $paiement, array $options = []): array
    {
        // Future integration: call Airtel API.
        return [
            'success' => true,
            'reference' => 'AIRTEL-' . strtoupper(uniqid()),
            'statut' => 'valide',
            'message' => 'Paiement Airtel Money simulé avec succès.',
        ];
    }
}
