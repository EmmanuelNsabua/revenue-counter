<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaxeRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only Super Admin or Admin can configure taxes
        return auth()->check() && (auth()->user()->isAdmin() || auth()->user()->isSuperAdmin());
    }

    public function rules(): array
    {
        return [
            'libelle' => 'required|string|max:255',
            'montant' => 'required|numeric|min:0',
            'frequence' => 'required|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'libelle.required' => 'Le libellé de la taxe est obligatoire.',
            'montant.required' => 'Le montant est obligatoire.',
            'montant.numeric' => 'Le montant doit être un format numérique.',
            'montant.min' => 'Le montant doit être au moins égal à 0.',
            'frequence.required' => 'La fréquence de taxation est obligatoire.',
        ];
    }
}
