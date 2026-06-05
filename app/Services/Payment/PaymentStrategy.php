<?php

namespace App\Services\Payment;

use App\Models\Paiement;

interface PaymentStrategy
{
    /**
     * Process the payment transaction.
     *
     * @param Paiement $paiement
     * @param array $options
     * @return array [success => bool, reference => string, statut => string, message => string]
     */
    public function process(Paiement $paiement, array $options = []): array;
}
