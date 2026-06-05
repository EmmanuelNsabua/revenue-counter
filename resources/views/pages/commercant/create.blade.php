@extends('layouts.app')

@section('title', 'Ajouter un Commerçant')

@section('content')
<div class="space-y-6 max-w-xl">
    <div>
        <h1 class="text-xl font-bold text-gray-900 md:text-2xl">Enregistrer un Commerçant</h1>
        <p class="text-sm text-gray-500">Ajouter un nouveau commerçant dans la base de données du marché de la Kenya.</p>
    </div>

    <x-card>
        <form method="POST" action="{{ route('commercant.store') }}" class="space-y-4">
            @csrf

            <!-- Name -->
            <x-input 
                type="text" 
                name="nom" 
                label="Nom et Prénom du commerçant" 
                placeholder="Ex: Jean Mukendi" 
                required 
            />

            <!-- Document Number -->
            <x-input 
                type="text" 
                name="numero_document" 
                label="Numéro de Document (ID Unique)" 
                placeholder="Ex: CD-KEN-998822" 
                required 
            />

            <!-- Activity Type -->
            <x-input 
                type="select" 
                name="type_activite" 
                label="Secteur d'activité" 
                required
            >
                <option value="">Sélectionnez le secteur...</option>
                <option value="Alimentation / Vivres">Alimentation / Vivres</option>
                <option value="Habillement / Friperie">Habillement / Friperie</option>
                <option value="Quincaillerie / Divers">Quincaillerie / Divers</option>
                <option value="Électronique / Services">Électronique / Services</option>
                <option value="Autre">Autre</option>
            </x-input>

            <!-- Location -->
            <x-input 
                type="text" 
                name="emplacement" 
                label="Emplacement / Numéro d'étal" 
                placeholder="Ex: Pavillon A, Étal 14" 
                required 
            />

            <!-- Actif -->
            <div class="flex items-center">
                <input 
                    id="actif" 
                    type="checkbox" 
                    name="actif" 
                    value="1" 
                    checked
                    class="h-5 w-5 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
                />
                <label for="actif" class="ml-2 block text-sm text-gray-900 font-semibold select-none">
                    Commerçant actif sur le marché
                </label>
            </div>

            <!-- Actions -->
            <div class="pt-3 flex space-x-2">
                <x-button type="submit" variant="primary" class="flex-1">
                    Enregistrer le profil
                </x-button>
                <a href="{{ route('commercant.index') }}" class="flex-1 inline-flex items-center justify-center h-[44px] border border-gray-300 hover:bg-gray-50 rounded-[6px] text-sm font-semibold transition">
                    Annuler
                </a>
            </div>
        </form>
    </x-card>
</div>
@endsection
