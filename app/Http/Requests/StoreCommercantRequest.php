<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommercantRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only admins can create/manage merchants
        return auth()->check() && (auth()->user()->isAdmin() || auth()->user()->isSuperAdmin());
    }

    public function rules(): array
    {
        return [
            'nom' => 'required|string|max:255',
            'numero_document' => 'required|string|max:100|unique:commercants,numero_document,' . ($this->commercant ?? 'NULL'),
            'type_activite' => 'required|string|max:255',
            'emplacement' => 'required|string|max:255',
            'actif' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom du commerçant est obligatoire.',
            'numero_document.required' => 'Le numéro de document est obligatoire.',
            'numero_document.unique' => 'Ce numéro de document est déjà attribué à un autre commerçant.',
            'type_activite.required' => 'Le type d\'activité est obligatoire.',
            'emplacement.required' => 'L\'emplacement est obligatoire.',
        ];
    }
}
