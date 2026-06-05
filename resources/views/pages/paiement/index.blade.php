@extends('layouts.app')

@section('title', 'Historique des Collectes')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
            <h1 class="text-xl font-bold text-gray-900 md:text-2xl">Historique des Paiements</h1>
            <p class="text-sm text-gray-500">Registre complet des transactions encaissées pour la commune de la Kenya.</p>
        </div>
        
        <a href="{{ route('paiement.create') }}" class="inline-flex items-center justify-center h-[44px] px-4 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-[6px] shadow-sm transition">
            <svg class="h-4.5 w-4.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nouveau Paiement
        </a>
    </div>

    <!-- Payments List Card -->
    <x-card title="Liste des Transactions">
        @if($paiements->isEmpty())
            <div class="text-center py-8">
                <p class="text-sm text-gray-500">Aucun paiement n'a été enregistré pour le moment.</p>
            </div>
        @else
            <x-table :headers="['Référence', 'Commerçant', 'Type Taxe', 'Date / Heure', 'Mode', 'Montant', 'Statut', 'Action']">
                @foreach($paiements as $paiement)
                    <tr class="hover:bg-gray-50">
                        <td class="px-4 py-3 font-semibold text-gray-950">{{ $paiement->reference }}</td>
                        <td class="px-4 py-3">
                            <div class="font-bold text-gray-900">{{ $paiement->commercant->nom }}</div>
                            <div class="text-xs text-gray-500 font-mono">{{ $paiement->commercant->numero_document }}</div>
                        </td>
                        <td class="px-4 py-3 text-gray-655">{{ $paiement->taxe->libelle }}</td>
                        <td class="px-4 py-3 text-gray-700">{{ $paiement->date_paiement->format('d/m/Y H:i') }}</td>
                        <td class="px-4 py-3 text-gray-755 uppercase font-medium text-xs">{{ $paiement->mode_paiement }}</td>
                        <td class="px-4 py-3 font-bold text-gray-950">{{ number_format($paiement->montant, 2, ',', ' ') }} FC</td>
                        <td class="px-4 py-3">
                            <x-badge :status="$paiement->statut" />
                        </td>
                        <td class="px-4 py-3 text-right">
                            <a href="{{ route('paiement.show', $paiement->id) }}" class="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-blue-900 border border-blue-900 hover:bg-blue-50 rounded transition">
                                Consulter Reçu
                            </a>
                        </td>
                    </tr>
                @endforeach
            </x-table>
        @endif
    </x-card>
</div>
@endsection
