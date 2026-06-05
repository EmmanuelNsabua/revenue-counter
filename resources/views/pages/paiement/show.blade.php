@extends('layouts.app')

@section('title', 'Détails du Paiement')

@section('content')
<div class="space-y-6 max-w-xl mx-auto">
    <!-- Header -->
    <div class="flex items-center space-x-2">
        <a href="{{ route('dashboard') }}" class="p-2 -ml-2 rounded text-gray-500 hover:text-gray-900 focus:outline-none">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </a>
        <div>
            <h1 class="text-xl font-bold text-gray-900 md:text-2xl">Confirmation du Paiement</h1>
            <p class="text-sm text-gray-500">Transaction validée par l'agent de la Kenya.</p>
        </div>
    </div>

    <!-- Confirmation Alert Box -->
    <div class="border border-green-200 bg-green-50 text-green-800 rounded-[6px] p-4 flex items-start">
        <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <div>
            <span class="font-bold text-sm">Paiement validé avec succès !</span>
            <p class="text-xs text-green-700 mt-1">Le reçu numérique numéro <span class="font-mono font-bold">{{ $paiement->recu->numero ?? 'N/A' }}</span> a été généré.</p>
        </div>
    </div>

    <!-- Virtual Receipt Ticket Container -->
    <div class="bg-white border border-gray-300 rounded-[6px] shadow-sm overflow-hidden p-6 relative">
        <!-- Ticket Border Cutout Design (Top and Bottom) -->
        <div class="absolute top-0 left-0 right-0 h-1 bg-blue-900"></div>

        <!-- Municipal Header -->
        <div class="text-center pb-4 border-b border-dashed border-gray-200">
            <h2 class="text-sm font-bold text-gray-900">COMMUNE DE LA KENYA</h2>
            <h3 class="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">Mairie de Lubumbashi</h3>
            <p class="text-xs font-mono text-gray-400 mt-2">ID Reçu: {{ $paiement->recu->numero ?? 'N/A' }}</p>
        </div>

        <!-- Ticket Parameters -->
        <div class="py-4 space-y-3 text-sm">
            <div class="flex justify-between">
                <span class="text-gray-500">Référence Transaction:</span>
                <span class="font-mono font-bold text-gray-900">{{ $paiement->reference }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-500">Date & Heure:</span>
                <span class="font-semibold text-gray-900">{{ $paiement->date_paiement->format('d/m/Y H:i:s') }}</span>
            </div>
            <hr class="border-dashed border-gray-250">
            <div class="flex justify-between">
                <span class="text-gray-500">Commerçant:</span>
                <span class="font-bold text-gray-900">{{ $paiement->commercant->nom }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-500">Doc Identité:</span>
                <span class="font-mono text-gray-700">{{ $paiement->commercant->numero_document }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-500">Emplacement Marché:</span>
                <span class="font-semibold text-gray-900">{{ $paiement->commercant->emplacement }}</span>
            </div>
            <hr class="border-dashed border-gray-250">
            <div class="flex justify-between">
                <span class="text-gray-500">Libellé Taxe:</span>
                <span class="font-bold text-gray-900">{{ $paiement->taxe->libelle }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-500">Mode de Paiement:</span>
                <span class="font-semibold text-gray-900 uppercase">{{ $paiement->mode_paiement }}</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-500">Agent Percepteur:</span>
                <span class="text-gray-900">{{ $paiement->agent->nom }} (ID: {{ $paiement->agent->id }})</span>
            </div>
            <hr class="border-dashed border-gray-250">
            <div class="flex justify-between items-center bg-gray-50 p-2.5 rounded">
                <span class="font-bold text-gray-700">Total Encaissé:</span>
                <span class="text-lg font-bold text-blue-900">{{ number_format($paiement->montant, 2, ',', ' ') }} FC</span>
            </div>
        </div>

        <!-- Footnote / Security Hash -->
        <div class="text-center pt-3 border-t border-dashed border-gray-200">
            <p class="text-[10px] text-gray-400 font-mono">Signé électroniquement / Code Sécurisé :<br>{{ sha1($paiement->reference) }}</p>
        </div>
    </div>

    <!-- Actions Buttons -->
    <div class="flex flex-col space-y-2">
        <a href="{{ route('paiement.recu', $paiement->id) }}" target="_blank" class="h-[44px] bg-blue-900 hover:bg-blue-800 text-white rounded-[6px] font-bold text-sm flex items-center justify-center shadow transition">
            <svg class="h-4.5 w-4.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimer le Reçu Papier
        </a>

        @php
            // WhatsApp sharing text composition
            $shareText = rawurlencode("MAIRIE DE LA KENYA\nReçu de Taxe : {$paiement->recu->numero}\nCommerçant : {$paiement->commercant->nom}\nMontant : " . number_format($paiement->montant, 2, ',', ' ') . " FC\nStatut : Validé\nRéf : {$paiement->reference}");
        @endphp
        <a href="https://api.whatsapp.com/send?text={{ $shareText }}" target="_blank" class="h-[44px] bg-green-600 hover:bg-green-700 text-white rounded-[6px] font-bold text-sm flex items-center justify-center shadow transition">
            <svg class="h-4.5 w-4.5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.989 3.3 1.488 4.965 1.488 5.4 0 9.79-4.394 9.794-9.802.002-2.617-1.012-5.078-2.859-6.927C16.638 2.062 14.182.95 11.562.95 6.162.95 1.77 5.344 1.767 10.75c-.001 1.768.463 3.493 1.343 5.021l-.988 3.606 3.693-.974.242.143z" />
            </svg>
            Partager sur WhatsApp
        </a>

        <a href="{{ route('dashboard') }}" class="h-[44px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 rounded-[6px] font-semibold text-sm flex items-center justify-center transition">
            Retour au Tableau de Bord
        </a>
    </div>
</div>
@endsection
