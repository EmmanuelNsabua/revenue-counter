<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaiementRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Allowed for all authenticated users (agents/admins)
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'commercant_id' => 'required|exists:commercants,id',
            'taxe_id' => 'required|exists:taxes,id',
            'montant' => 'nullable|numeric|min:0',
            'mode_paiement' => 'required|in:cash,mpesa,airtel,orange',
        ];
    }

    public function messages(): array
    {
        return [
            'commercant_id.required' => 'Le commerçant est obligatoire.',
            'commercant_id.exists' => 'Le commerçant sélectionné est invalide.',
            'taxe_id.required' => 'Le type de taxe est obligatoire.',
            'taxe_id.exists' => 'La taxe sélectionnée est invalide.',
            'montant.numeric' => 'Le montant doit être un nombre valide.',
            'montant.min' => 'Le montant doit être supérieur ou égal à 0.',
            'mode_paiement.required' => 'Le mode de paiement est obligatoire.',
            'mode_paiement.in' => 'Le mode de paiement sélectionné est invalide.',
        ];
    }
}
