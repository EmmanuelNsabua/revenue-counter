@extends('layouts.app')

@section('title', 'Recherche des Commerçants')

@section('content')
<div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
            <h1 class="text-xl font-bold text-gray-900 md:text-2xl">Registre des Commerçants</h1>
            <p class="text-sm text-gray-500">Recherchez un commerçant pour vérifier son statut ou enregistrer un paiement.</p>
        </div>
        
        @if(auth()->user()->isAdmin() || auth()->user()->isSuperAdmin())
            <a href="{{ route('commercant.create') }}" class="inline-flex items-center justify-center h-[44px] px-4 text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-[6px] shadow-sm transition">
                <svg class="h-4.5 w-4.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ajouter un Commerçant
            </a>
        @endif
    </div>

    <!-- Search Card -->
    <x-card>
        <form method="GET" action="{{ route('commercant.index') }}" class="flex flex-col md:flex-row gap-3">
            <div class="flex-1">
                <x-input 
                    type="text" 
                    name="search" 
                    placeholder="Saisissez le nom, le numéro de document ou l'emplacement..."
                    value="{{ $query ?? '' }}"
                />
            </div>
            <div class="flex space-x-2">
                <x-button type="submit" variant="primary" class="w-full md:w-auto">
                    Rechercher
                </x-button>
                @if($query)
                    <a href="{{ route('commercant.index') }}" class="inline-flex items-center justify-center h-[44px] px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-[6px] hover:bg-gray-50 transition">
                        Réinitialiser
                    </a>
                @endif
            </div>
        </form>
    </x-card>

    <!-- Results Card -->
    <x-card title="Résultats de la recherche">
        @if($commercants->isEmpty())
            <div class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="mt-2 text-sm font-bold text-gray-900">Aucun commerçant trouvé</h3>
                <p class="mt-1 text-sm text-gray-500">Essayez d'ajuster vos filtres de recherche.</p>
            </div>
        @else
            <x-table :headers="['Commerçant', 'Document', 'Activité', 'Emplacement', 'Statut', 'Actions']">
                @foreach($commercants as $commercant)
                    <tr class="hover:bg-gray-50">
                        <td class="px-4 py-3">
                            <div class="font-bold text-gray-900">{{ $commercant->nom }}</div>
                            @if(!$commercant->actif)
                                <span class="text-xs text-red-600 font-semibold">(Profil inactif)</span>
                            @endif
                        </td>
                        <td class="px-4 py-3 font-mono text-gray-700">{{ $commercant->numero_document }}</td>
                        <td class="px-4 py-3 text-gray-655">{{ $commercant->type_activite }}</td>
                        <td class="px-4 py-3 font-semibold text-gray-950">{{ $commercant->emplacement }}</td>
                        <td class="px-4 py-3">
                            @php
                                // Calcul du statut fiscal du commerçant (payé aujourd'hui ?)
                                $aPayeAujourdhui = $commercant->paiements()
                                    ->whereDate('date_paiement', \Carbon\Carbon::today())
                                    ->where('statut', 'valide')
                                    ->exists();
                            @endphp
                            @if($aPayeAujourdhui)
                                <x-badge status="paye" />
                            @else
                                <x-badge status="non_paye" />
                            @endif
                        </td>
                        <td class="px-4 py-3 text-right">
                            <div class="flex items-center justify-end space-x-2">
                                @if($commercant->actif)
                                    <a href="{{ route('paiement.create', ['commercant_id' => $commercant->id]) }}" class="inline-flex items-center justify-center h-9 px-3 text-xs font-bold text-white bg-green-655 hover:bg-green-700 rounded transition shadow-sm bg-green-600">
                                        Percevoir Taxe
                                    </a>
                                @endif
                                
                                @if(auth()->user()->isAdmin() || auth()->user()->isSuperAdmin())
                                    <a href="{{ route('commercant.edit', $commercant->id) }}" class="inline-flex items-center justify-center h-9 px-3 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded transition">
                                        Modifier
                                    </a>
                                @endif
                            </div>
                        </td>
                    </tr>
                @endforeach
            </x-table>
        @endif
    </x-card>
</div>
@endsection
