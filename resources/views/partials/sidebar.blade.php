<!-- Sidebar Container -->
<div class="hidden md:flex flex-col w-64 bg-blue-900 text-white flex-shrink-0 border-r border-blue-950">
    <!-- Header -->
    <div class="h-16 flex items-center justify-between px-4 bg-blue-950">
        <span class="text-lg font-bold tracking-wider">MAIRIE DE LA KENYA</span>
    </div>

    <!-- Navigation List -->
    <div class="flex-1 flex flex-col justify-between overflow-y-auto mt-4">
        <nav class="flex-1 px-2 space-y-1">
            <!-- Dashboard Link -->
            <a href="{{ route('dashboard') }}" class="group flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-blue-800 {{ request()->routeIs('dashboard') ? 'bg-blue-950 border-l-4 border-white' : '' }}">
                <!-- Icon Dashboard -->
                <svg class="mr-3 h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                Tableau de bord
            </a>

            <!-- Register Payment (Primary Call to Action, highlighted) -->
            <a href="{{ route('paiement.create') }}" class="group flex items-center px-3 py-3 text-sm font-semibold rounded-md bg-green-600 hover:bg-green-700 text-white mt-2">
                <svg class="mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Percevoir une Taxe
            </a>

            <!-- Commerçants Link -->
            <a href="{{ route('commercant.index') }}" class="group flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-blue-800 {{ request()->routeIs('commercant.*') ? 'bg-blue-950 border-l-4 border-white' : '' }}">
                <!-- Icon Users -->
                <svg class="mr-3 h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Rechercher Commerçant
            </a>

            <!-- Historique Link -->
            <a href="{{ route('paiement.index') }}" class="group flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-blue-800 {{ request()->routeIs('paiement.index') || request()->routeIs('paiement.show') ? 'bg-blue-950 border-l-4 border-white' : '' }}">
                <!-- Icon Cash -->
                <svg class="mr-3 h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Historique Collectes
            </a>

            <!-- Config Taxes Link (Admin / Super Admin only) -->
            @if(auth()->check() && (auth()->user()->isAdmin() || auth()->user()->isSuperAdmin()))
                <a href="{{ route('admin.taxes') }}" class="group flex items-center px-3 py-3 text-sm font-medium rounded-md hover:bg-blue-800 {{ request()->routeIs('admin.taxes') ? 'bg-blue-950 border-l-4 border-white' : '' }}">
                    <!-- Icon Adjustments / Cog -->
                    <svg class="mr-3 h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Gestion des Taxes
                </a>
            @endif
        </nav>

        <!-- Logged In User & Logout -->
        <div class="p-4 bg-blue-950 flex flex-col space-y-2">
            <div class="flex items-center space-x-2">
                <div class="h-8 w-8 bg-blue-800 rounded-full flex items-center justify-center font-bold text-sm text-white">
                    {{ substr(auth()->user()->nom, 0, 2) }}
                </div>
                <div class="truncate">
                    <p class="text-sm font-semibold truncate">{{ auth()->user()->nom }}</p>
                    <p class="text-xs text-gray-400 capitalize">{{ auth()->user()->role }}</p>
                </div>
            </div>
            
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="w-full text-left text-xs text-red-300 hover:text-red-400 py-1 font-medium transition duration-150">
                    Déconnexion
                </button>
            </form>
        </div>
    </div>
</div>
