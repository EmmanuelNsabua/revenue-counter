@extends('layouts.app')

@section('title', 'Gestion des Taxes')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div>
        <h1 class="text-xl font-bold text-gray-900 md:text-2xl">Configuration des Taxes Municipales</h1>
        <p class="text-sm text-gray-500">Définissez les types de taxes applicables et leurs montants standard de recouvrement.</p>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- List of Taxes (Left side) -->
        <div class="lg:col-span-2 space-y-4">
            <x-card title="Taxes configurées">
                @if($taxes->isEmpty())
                    <p class="text-sm text-gray-500 py-4 text-center">Aucune taxe n'est configurée pour le moment.</p>
                @else
                    <x-table :headers="['Libellé', 'Montant par défaut', 'Fréquence de collecte', 'Actions']">
                        @foreach($taxes as $taxe)
                            <tr class="hover:bg-gray-50">
                                <td class="px-4 py-3">
                                    <div class="font-bold text-gray-900">{{ $taxe->libelle }}</div>
                                    <div class="text-xs text-gray-400">ID: {{ $taxe->id }}</div>
                                </td>
                                <td class="px-4 py-3 font-bold text-blue-900">{{ number_format($taxe->montant, 2, ',', ' ') }} FC</td>
                                <td class="px-4 py-3">
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
                                        {{ $taxe->frequence }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-right">
                                    <!-- In-place edit trigger helper -->
                                    <button 
                                        onclick="fillEditForm({{ json_encode($taxe) }})" 
                                        class="inline-flex items-center px-2.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded transition"
                                    >
                                        Modifier
                                    </button>
                                </td>
                            </tr>
                        @endforeach
                    </x-table>
                @endif
            </x-card>
        </div>

        <!-- Add / Edit Form (Right side) -->
        <div>
            <x-card id="form-card" title="Ajouter une Taxe">
                <!-- We dynamically adjust action based on adding/editing -->
                <form id="taxe-form" method="POST" action="{{ route('admin.taxes.store') }}" class="space-y-4">
                    @csrf
                    <input type="hidden" name="_method" id="form-method" value="POST">

                    <!-- Libelle -->
                    <x-input 
                        type="text" 
                        name="libelle" 
                        id="taxe-libelle"
                        label="Libellé de la taxe" 
                        placeholder="Ex: Taxe d'étalage journalière" 
                        required 
                    />

                    <!-- Montant -->
                    <x-input 
                        type="number" 
                        name="montant" 
                        id="taxe-montant"
                        label="Montant standard (FC)" 
                        placeholder="Ex: 1500" 
                        required 
                    />

                    <!-- Frequence -->
                    <x-input 
                        type="select" 
                        name="frequence" 
                        id="taxe-frequence"
                        label="Fréquence" 
                        required
                    >
                        <option value="journalier">Journalier (Chaque jour)</option>
                        <option value="mensuel">Mensuel (Chaque mois)</option>
                        <option value="trimestriel">Trimestriel (Chaque 3 mois)</option>
                        <option value="annuel">Annuel (Chaque année)</option>
                    </x-input>

                    <!-- Submit Buttons -->
                    <div class="pt-2 space-y-2">
                        <x-button type="submit" id="submit-btn" variant="primary" class="w-full">
                            Enregistrer la Taxe
                        </x-button>
                        
                        <!-- Cancel edit button (hidden by default) -->
                        <button 
                            type="button" 
                            id="cancel-edit-btn" 
                            onclick="resetTaxeForm()" 
                            class="hidden w-full h-[44px] bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-[6px] text-sm font-semibold transition"
                        >
                            Annuler la modification
                        </button>
                    </div>
                </form>
            </x-card>
        </div>
    </div>
</div>

<script>
    // Fills the right card with tax values for editing
    function fillEditForm(taxe) {
        document.getElementById('form-card').querySelector('h3').textContent = 'Modifier la Taxe ID: ' + taxe.id;
        
        // Change action url
        const form = document.getElementById('taxe-form');
        form.action = '/admin/taxes/' + taxe.id;
        
        // Put PUT method override
        document.getElementById('form-method').value = 'PUT';

        // Fill inputs
        document.getElementById('taxe-libelle').value = taxe.libelle;
        document.getElementById('taxe-montant').value = parseFloat(taxe.montant);
        document.getElementById('taxe-frequence').value = taxe.frequence;

        // Toggle buttons
        document.getElementById('submit-btn').textContent = 'Mettre à jour la Taxe';
        document.getElementById('cancel-edit-btn').classList.remove('hidden');
    }

    // Resets the form back to addition mode
    function resetTaxeForm() {
        document.getElementById('form-card').querySelector('h3').textContent = 'Ajouter une Taxe';
        
        const form = document.getElementById('taxe-form');
        form.action = "{{ route('admin.taxes.store') }}";
        
        document.getElementById('form-method').value = 'POST';

        form.reset();

        document.getElementById('submit-btn').textContent = 'Enregistrer la Taxe';
        document.getElementById('cancel-edit-btn').classList.add('hidden');
    }
</script>
@endsection
