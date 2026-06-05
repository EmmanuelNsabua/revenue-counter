@extends('layouts.app')

@section('title', 'Percevoir une Taxe')

@section('content')
<div class="space-y-6 max-w-xl">
    <div>
        <h1 class="text-xl font-bold text-gray-900 md:text-2xl">Percevoir une Taxe</h1>
        <p class="text-sm text-gray-500">Formulaire d'encaissement direct — Mode Cash prioritaire.</p>
    </div>

    <!-- Client-side alerts container (for offline and validation warnings) -->
    <div id="client-alert-box" class="hidden"></div>

    <x-card>
        <!-- The form id is used by local storage sync script when offline -->
        <form id="payment-form" method="POST" action="{{ route('paiement.store') }}" class="space-y-4">
            @csrf

            <!-- Commercant selector -->
            <div>
                <label for="commercant_id" class="text-sm font-bold text-gray-700">
                    Commerçant <span class="text-red-650 text-red-600">*</span>
                </label>
                <select 
                    name="commercant_id" 
                    id="commercant_id" 
                    required 
                    class="h-[44px] block w-full px-3 rounded-[6px] border border-gray-300 bg-white text-gray-950 shadow-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900 text-base transition duration-150"
                >
                    <option value="">Sélectionnez le commerçant...</option>
                    @foreach($commercants as $c)
                        <option value="{{ $c->id }}" 
                                data-document="{{ $c->numero_document }}"
                                data-emplacement="{{ $c->emplacement }}"
                                {{ (isset($commercant) && $commercant->id == $c->id) ? 'selected' : '' }}
                        >
                            {{ $c->nom }} ({{ $c->numero_document }} — {{ $c->emplacement }})
                        </option>
                    @endforeach
                </select>
                @error('commercant_id')
                    <p class="text-xs text-red-655 font-semibold mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Taxe Selector -->
            <div>
                <label for="taxe_id" class="text-sm font-bold text-gray-700">
                    Type de Taxe <span class="text-red-650 text-red-600">*</span>
                </label>
                <select 
                    name="taxe_id" 
                    id="taxe_id" 
                    required 
                    class="h-[44px] block w-full px-3 rounded-[6px] border border-gray-300 bg-white text-gray-950 shadow-sm focus:border-blue-900 focus:ring-1 focus:ring-blue-900 text-base transition duration-150"
                >
                    <option value="">Sélectionnez le type de taxe...</option>
                    @foreach($taxes as $t)
                        <option value="{{ $t->id }}" data-montant="{{ $t->montant }}">
                            {{ $t->libelle }} ({{ number_format($t->montant, 2, ',', ' ') }} FC — {{ $t->frequence }})
                        </option>
                    @endforeach
                </select>
                @error('taxe_id')
                    <p class="text-xs text-red-655 font-semibold mt-1">{{ $message }}</p>
                @enderror
            </div>

            <!-- Montant (automatiquement pré-rempli mais modifiable) -->
            <div>
                <x-input 
                    type="number" 
                    name="montant" 
                    id="montant-input"
                    label="Montant Perçu (FC)" 
                    placeholder="Saisissez le montant perçu" 
                    required 
                />
            </div>

            <!-- Mode de paiement (uniquement CASH pour le MVP, mais extensible visuellement) -->
            <div>
                <label class="text-sm font-bold text-gray-700 block mb-2">Mode de paiement</label>
                
                <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <!-- Cash Option (Active by default) -->
                    <label class="border-2 border-blue-900 bg-blue-50 rounded-[6px] p-3 flex items-center justify-between cursor-pointer select-none">
                        <div class="flex items-center">
                            <input type="radio" name="mode_paiement" value="cash" checked class="h-5 w-5 text-blue-900 focus:ring-blue-900 border-gray-300">
                            <span class="ml-3 font-semibold text-gray-900 text-sm">Espèces (Cash)</span>
                        </div>
                        <span class="text-xs bg-blue-900 text-white font-bold px-2 py-0.5 rounded">MVP</span>
                    </label>

                    <!-- Mobile Money Option (Visual helper showing future strategy readiness) -->
                    <div class="border border-gray-250 opacity-60 bg-gray-50 rounded-[6px] p-3 flex items-center justify-between cursor-not-allowed select-none border-gray-300">
                        <div class="flex items-center">
                            <input type="radio" name="mode_paiement" value="mpesa" disabled class="h-5 w-5 text-gray-350 border-gray-300">
                            <span class="ml-3 font-semibold text-gray-500 text-sm">Mobile Money</span>
                        </div>
                        <span class="text-xs bg-gray-400 text-white font-semibold px-2 py-0.5 rounded">Bientôt</span>
                    </div>
                </div>
            </div>

            <!-- Submit Button (Always prominent and at the bottom) -->
            <div class="pt-4">
                <x-button type="submit" variant="primary" class="w-full h-[48px] text-base font-bold shadow">
                    VALIDER ET REÇEVOIR LE PAIEMENT
                </x-button>
            </div>
        </form>
    </x-card>
</div>

<!-- Simulated Receipt Popup Modal for Offline validation feedback -->
<div id="offline-success-modal" class="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center p-4 z-50 hidden">
    <div class="bg-white rounded-[6px] max-w-sm w-full p-4 border border-gray-300 shadow-lg flex flex-col space-y-4">
        <div class="text-center">
            <div class="mx-auto h-12 w-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-2">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-950">Paiement Enregistré (Hors-ligne)</h3>
            <p class="text-xs text-gray-500 mt-1">Le paiement a été stocké localement et sera synchronisé dès le retour du réseau.</p>
        </div>

        <!-- Virtual Ticket Box -->
        <div class="border-2 border-dashed border-gray-300 bg-gray-50 p-3 text-xs font-mono space-y-2">
            <p class="text-center font-bold">COMMUNE DE LA KENYA<br>REÇU DE TAXE DU MARCHÉ</p>
            <hr class="border-dashed border-gray-300">
            <p><strong>Réf Local:</strong> <span id="val-local-ref">-</span></p>
            <p><strong>Date/Heure:</strong> <span id="val-datetime">-</span></p>
            <p><strong>Commerçant:</strong> <span id="val-merchant">-</span></p>
            <p><strong>Type de Taxe:</strong> <span id="val-tax">-</span></p>
            <p><strong>Montant Perçu:</strong> <span id="val-amount">-</span> FC</p>
            <hr class="border-dashed border-gray-300">
            <p class="text-center font-semibold text-green-800">EN ATTENTE DE SYNCHRO</p>
        </div>

        <button id="close-offline-modal-btn" class="w-full h-[44px] bg-blue-900 hover:bg-blue-800 text-white rounded-[6px] font-bold text-sm">
            OK, Continuer la collecte
        </button>
    </div>
</div>

<!-- Script parameters for anti-fraud and offline checks -->
<script>
    // List of merchants who have paid today (provided by the backend for real-time checking)
    const paidCommercantIds = @json($commercants->filter(function($c) {
        return $c->paiements()->whereDate('date_paiement', \Carbon\Carbon::today())->where('statut', 'valide')->exists();
    })->pluck('id'));

    document.addEventListener('DOMContentLoaded', function() {
        const selectTax = document.getElementById('taxe_id');
        const selectMerchant = document.getElementById('commercant_id');
        const inputAmount = document.getElementById('montant-input');
        const alertBox = document.getElementById('client-alert-box');
        const form = document.getElementById('payment-form');

        // Automatically update the default amount when selecting a tax
        selectTax.addEventListener('change', function() {
            const selectedOption = selectTax.options[selectTax.selectedIndex];
            if (selectedOption && selectedOption.dataset.montant) {
                inputAmount.value = parseFloat(selectedOption.dataset.montant);
            } else {
                inputAmount.value = '';
            }
        });

        // Anti-fraud check: Warn instantly if the selected merchant has already paid today
        selectMerchant.addEventListener('change', function() {
            const selectedVal = parseInt(selectMerchant.value);
            if (paidCommercantIds.includes(selectedVal)) {
                alertBox.className = "mb-4 border border-yellow-300 bg-yellow-50 text-yellow-900 text-sm rounded-[6px] p-3";
                alertBox.innerHTML = `
                    <div class="flex items-start">
                        <svg class="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <span class="font-bold">Avertissement de doublon !</span> Ce commerçant a déjà effectué un paiement de taxe valide aujourd'hui. Veuillez revérifier ses justificatifs papier.
                        </div>
                    </div>
                `;
                alertBox.classList.remove('hidden');
            } else {
                alertBox.classList.add('hidden');
            }
        });

        // Intercept submit when offline to store in LocalStorage and trigger simulated ticket popup
        form.addEventListener('submit', function(e) {
            if (!navigator.onLine) {
                e.preventDefault(); // Stop HTTP submission

                const merchantId = selectMerchant.value;
                const merchantName = selectMerchant.options[selectMerchant.selectedIndex].text;
                const taxId = selectTax.value;
                const taxLabel = selectTax.options[selectTax.selectedIndex].text;
                const amount = inputAmount.value;
                const mode = form.elements['mode_paiement'].value;

                if (!merchantId || !taxId || !amount) {
                    alert("Veuillez remplir correctement tous les champs obligatoires.");
                    return;
                }

                // Create local transaction object
                const localId = 'OFF-' + Date.now();
                const offlinePayment = {
                    local_id: localId,
                    commercant_id: merchantId,
                    commercant_name: merchantName,
                    taxe_id: taxId,
                    taxe_label: taxLabel,
                    montant: amount,
                    mode_paiement: mode,
                    date_paiement: new Date().toISOString()
                };

                // Add to LocalStorage queue
                let queue = JSON.parse(localStorage.getItem('offline_payments') || '[]');
                queue.push(offlinePayment);
                localStorage.setItem('offline_payments', JSON.stringify(queue));

                // Dispatch event to update sync buttons immediately
                window.dispatchEvent(new Event('offline-payment-added'));

                // Populate and trigger success simulated receipt popup modal
                document.getElementById('val-local-ref').textContent = localId;
                document.getElementById('val-datetime').textContent = new Date().toLocaleString('fr-FR');
                document.getElementById('val-merchant').textContent = merchantName;
                document.getElementById('val-tax').textContent = taxLabel;
                document.getElementById('val-amount').textContent = amount;
                
                document.getElementById('offline-success-modal').classList.remove('hidden');
            }
        });

        // Close simulated ticket modal and redirect to dashboard
        document.getElementById('close-offline-modal-btn').addEventListener('click', function() {
            document.getElementById('offline-success-modal').classList.add('hidden');
            window.location.href = "{{ route('dashboard') }}";
        });
    });
</script>
@endsection
