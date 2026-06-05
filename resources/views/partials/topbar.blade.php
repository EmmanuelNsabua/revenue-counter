<!-- Topbar -->
<header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10">
    <!-- Left side: Mobile Hamburger and Title -->
    <div class="flex items-center space-x-3">
        <!-- Mobile menu toggle (simple click redirect as a fallback, or CSS-based toggle) -->
        <div class="md:hidden">
            <a href="{{ route('dashboard') }}" class="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </a>
        </div>
        <div class="flex flex-col">
            <span class="text-sm font-semibold text-gray-900 md:text-base">Lubumbashi — Kenya</span>
            <span class="text-xs text-gray-500 capitalize md:hidden">{{ auth()->user()->nom }} ({{ auth()->user()->role }})</span>
        </div>
    </div>

    <!-- Right side: Connection indicator and Quick Action -->
    <div class="flex items-center space-x-3">
        <!-- Offline Indicator Component -->
        <x-offline-indicator />

        <!-- Sync Button (appears when offline records exist, handled by JS) -->
        <button id="manual-sync-btn" class="hidden h-9 px-3 text-xs bg-blue-900 hover:bg-blue-800 text-white rounded font-medium items-center space-x-1 transition shadow-sm">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
            </svg>
            <span>Synchroniser (<span id="offline-count-badge">0</span>)</span>
        </button>

        <!-- Profile / Quick Logout for mobile -->
        <div class="md:hidden">
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="p-2 text-red-600 hover:text-red-800 focus:outline-none" title="Déconnexion">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </form>
        </div>
    </div>
</header>
