@extends('layouts.app')

@section('title', 'Tableau de bord')

@section('content')
<div class="space-y-6">
    <!-- Header Page -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
            <h1 class="text-xl font-bold text-gray-900 md:text-2xl">Statut Général du Recouvrement</h1>
            <p class="text-sm text-gray-500">Mise à jour en temps réel des transactions du marché de la Kenya.</p>
        </div>
        
        <!-- Big principal action button -->
        <a href="{{ route('paiement.create') }}" class="inline-flex items-center justify-center h-[48px] px-6 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-[6px] shadow-sm select-none transition">
            <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            PERCEVOIR UNE TAXE (CASH)
        </a>
    </div>

    <!-- Stat Grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Revenue Collected Card -->
        <x-card class="border-l-4 border-blue-900">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Perçu Aujourd'hui</p>
                    <p class="text-2xl font-bold text-gray-950 mt-1">{{ number_format($sommeCollectee, 2, ',', ' ') }} FC</p>
                </div>
                <div class="p-2 bg-blue-50 text-blue-900 rounded">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
            <div class="mt-2">
                <span class="text-xs text-gray-500">Mairie de Lubumbashi</span>
            </div>
        </x-card>

        <!-- Payments Counter Card -->
        <x-card class="border-l-4 border-green-600">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Transactions Validées</p>
                    <p class="text-2xl font-bold text-gray-950 mt-1">{{ $nombreTransactions }} reçus</p>
                </div>
                <div class="p-2 bg-green-50 text-green-600 rounded">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
            <div class="mt-2">
                <span class="text-xs text-gray-500">Validations immédiates</span>
            </div>
        </x-card>

        <!-- Remaining Unpaid Card -->
        <x-card class="border-l-4 border-yellow-500">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Commerçants Restants</p>
                    <p class="text-2xl font-bold text-gray-950 mt-1">~{{ $commercantsNonRegle }} estimé</p>
                </div>
                <div class="p-2 bg-yellow-50 text-yellow-650 rounded">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
            </div>
            <div class="mt-2">
                <span class="text-xs text-gray-500">Recouvrement actif</span>
            </div>
        </x-card>
    </div>

    <!-- Recent Payments List -->
    <x-card title="Dernières Transactions Enregistrées">
        @if($transactionsRecentes->isEmpty())
            <div class="text-center py-6">
                <p class="text-sm text-gray-500">Aucune transaction enregistrée pour l'instant aujourd'hui.</p>
            </div>
        @else
            <x-table :headers="['Référence', 'Commerçant', 'Taxe', 'Montant', 'Statut', 'Actions']">
                @foreach($transactionsRecentes as $paiement)
                    <tr class="hover:bg-gray-50">
                        <td class="px-4 py-3 font-semibold text-gray-950">{{ $paiement->reference }}</td>
                        <td class="px-4 py-3 text-gray-700">
                            <div>
                                <p class="font-semibold text-gray-900">{{ $paiement->commercant->nom }}</p>
                                <p class="text-xs text-gray-500">Doc: {{ $paiement->commercant->numero_document }}</p>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-gray-700">{{ $paiement->taxe->libelle }}</td>
                        <td class="px-4 py-3 font-bold text-gray-950">{{ number_format($paiement->montant, 2, ',', ' ') }} FC</td>
                        <td class="px-4 py-3">
                            <x-badge :status="$paiement->statut" />
                        </td>
                        <td class="px-4 py-3 text-right">
                            <a href="{{ route('paiement.show', $paiement->id) }}" class="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-blue-900 border border-blue-900 hover:bg-blue-50 rounded transition">
                                Voir Reçu
                            </a>
                        </td>
                    </tr>
                @endforeach
            </x-table>
        @endif
    </x-card>
</div>
@endsection
