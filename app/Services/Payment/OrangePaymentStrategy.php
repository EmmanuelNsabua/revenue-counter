<?php

namespace App\Services\Payment;

use App\Models\Paiement;

class OrangePaymentStrategy implements PaymentStrategy
{
    public function process(Paiement $paiement, array $options = []): array
    {
        // Future integration: call Orange API.
        return [
            'success' => true,
            'reference' => 'ORANGE-' . strtoupper(uniqid()),
            'statut' => 'valide',
            'message' => 'Paiement Orange Money simulé avec succès.',
        ];
    }
}
