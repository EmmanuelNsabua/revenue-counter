<?php

namespace App\Services\Payment;

use InvalidArgumentException;

class PaymentStrategyFactory
{
    protected array $strategies = [
        'cash' => CashPaymentStrategy::class,
        'mpesa' => MpesaPaymentStrategy::class,
        'airtel' => AirtelPaymentStrategy::class,
        'orange' => OrangePaymentStrategy::class,
    ];

    /**
     * Resolve the corresponding payment strategy.
     *
     * @param string $mode
     * @return PaymentStrategy
     */
    public function make(string $mode): PaymentStrategy
    {
        $mode = strtolower($mode);
        if (!isset($this->strategies[$mode])) {
            throw new InvalidArgumentException("Le mode de paiement [{$mode}] n'est pas pris en charge par le système.");
        }

        return app($this->strategies[$mode]);
    }
}
