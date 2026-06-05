<?php

namespace App\Services\Payment;

use App\Models\Paiement;

class MpesaPaymentStrategy implements PaymentStrategy
{
    public function process(Paiement $paiement, array $options = []): array
    {
        // Future integration: call M-Pesa API here.
        // For MVP/Demo purposes, we return a mock success structure.
        return [
            'success' => true,
            'reference' => 'MPESA-' . strtoupper(uniqid()),
            'statut' => 'valide',
            'message' => 'Paiement M-Pesa simulé avec succès.',
        ];
    }
}
