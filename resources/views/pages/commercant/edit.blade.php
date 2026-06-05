@extends('layouts.app')

@section('title', 'Modifier un Commerçant')

@section('content')
<div class="space-y-6 max-w-xl">
    <div>
        <h1 class="text-xl font-bold text-gray-900 md:text-2xl">Modifier le Profil du Commerçant</h1>
        <p class="text-sm text-gray-500">Mettre à jour les informations de {{ $commercant->nom }}.</p>
    </div>

    <x-card>
        <form method="POST" action="{{ route('commercant.update', $commercant->id) }}" class="space-y-4">
            @csrf
            @method('PUT')

            <!-- Name -->
            <x-input 
                type="text" 
                name="nom" 
                label="Nom et Prénom du commerçant" 
                value="{{ $commercant->nom }}" 
                required 
            />

            <!-- Document Number -->
            <x-input 
                type="text" 
                name="numero_document" 
                label="Numéro de Document (ID Unique)" 
                value="{{ $commercant->numero_document }}" 
                required 
            />

            <!-- Activity Type -->
            <x-input 
                type="select" 
                name="type_activite" 
                label="Secteur d'activité" 
                value="{{ $commercant->type_activite }}"
                required
            >
                <option value="Alimentation / Vivres" {{ $commercant->type_activite === 'Alimentation / Vivres' ? 'selected' : '' }}>Alimentation / Vivres</option>
                <option value="Habillement / Friperie" {{ $commercant->type_activite === 'Habillement / Friperie' ? 'selected' : '' }}>Habillement / Friperie</option>
                <option value="Quincaillerie / Divers" {{ $commercant->type_activite === 'Quincaillerie / Divers' ? 'selected' : '' }}>Quincaillerie / Divers</option>
                <option value="Électronique / Services" {{ $commercant->type_activite === 'Électronique / Services' ? 'selected' : '' }}>Électronique / Services</option>
                <option value="Autre" {{ $commercant->type_activite === 'Autre' ? 'selected' : '' }}>Autre</option>
            </x-input>

            <!-- Location -->
            <x-input 
                type="text" 
                name="emplacement" 
                label="Emplacement / Numéro d'étal" 
                value="{{ $commercant->emplacement }}" 
                required 
            />

            <!-- Actif -->
            <div class="flex items-center">
                <input 
                    id="actif" 
                    type="checkbox" 
                    name="actif" 
                    value="1" 
                    {{ $commercant->actif ? 'checked' : '' }}
                    class="h-5 w-5 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
                />
                <label for="actif" class="ml-2 block text-sm text-gray-900 font-semibold select-none">
                    Commerçant actif sur le marché
                </label>
            </div>

            <!-- Actions -->
            <div class="pt-3 flex space-x-2">
                <x-button type="submit" variant="primary" class="flex-1">
                    Enregistrer les modifications
                </x-button>
                <a href="{{ route('commercant.index') }}" class="flex-1 inline-flex items-center justify-center h-[44px] border border-gray-300 hover:bg-gray-50 rounded-[6px] text-sm font-semibold transition">
                    Annuler
                </a>
            </div>
        </form>
    </x-card>
</div>
@endsection
