@extends('layouts.auth')

@section('content')
<x-card class="border-gray-300">
    <div class="mb-4">
        <h2 class="text-xl font-bold text-gray-900">Espace Agent de Recouvrement</h2>
        <p class="text-xs text-gray-500 mt-1">Veuillez saisir vos paramètres de connexion pour accéder à l'application.</p>
    </div>

    <form method="POST" action="{{ route('login') }}" class="space-y-4">
        @csrf

        <!-- Email Address -->
        <x-input 
            type="email" 
            name="email" 
            label="Adresse Email de l'Agent" 
            placeholder="agent@kenya.lubumbashi.cd" 
            value="{{ old('email') }}" 
            required 
            autofocus 
        />

        <!-- Password -->
        <x-input 
            type="password" 
            name="password" 
            label="Mot de passe" 
            placeholder="Saisissez votre mot de passe" 
            required 
        />

        <!-- Remember Me -->
        <div class="flex items-center">
            <input 
                id="remember" 
                type="checkbox" 
                name="remember" 
                class="h-5 w-5 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-900 font-semibold select-none">
                Se souvenir de moi
            </label>
        </div>

        <!-- Submit Button -->
        <div class="pt-2">
            <x-button type="submit" variant="primary" class="w-full">
                Se connecter à la session
            </x-button>
        </div>
    </form>
</x-card>
@endsection
