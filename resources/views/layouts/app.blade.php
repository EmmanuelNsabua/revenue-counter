<!DOCTYPE html>
<html lang="fr" class="h-full bg-gray-50">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Tableau de bord') - Revenue Counter</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <!-- PWA Meta -->
    <meta name="theme-color" content="#1E3A8A">
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/icons/icon-192x192.png">
</head>
<body class="h-full flex flex-col md:flex-row overflow-hidden text-gray-900">
    
    <!-- Sidebar navigation (desktop visible, mobile hidden) -->
    @include('partials.sidebar')

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Topbar (User info, sync action, offline status) -->
        @include('partials.topbar')

        <!-- Scrollable content -->
        <main class="flex-1 overflow-y-auto focus:outline-none p-4 md:p-6" style="scroll-behavior: smooth;">
            
            <!-- Global Flash feedback alerts -->
            @if (session('success'))
                <x-feedback-alert type="success" message="{{ session('success') }}" class="mb-4" />
            @endif

            @if (session('error'))
                <x-feedback-alert type="danger" message="{{ session('error') }}" class="mb-4" />
            @endif

            <!-- Offline synchronisation message placeholder -->
            <div id="sync-status-container" class="hidden mb-4">
                <div class="bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded p-3 flex items-center justify-between">
                    <span id="sync-status-text">Synchronisation en cours...</span>
                    <span class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-800 border-t-transparent"></span>
                </div>
            </div>

            @yield('content')
        </main>
    </div>

    <!-- PWA Offline Scripts -->
    <script src="/js/offline-handler.js"></script>
    <script>
        // Register Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(reg => console.log('Service Worker Terrain enregistré : ', reg.scope))
                    .catch(err => console.error('Erreur Service Worker : ', err));
            });
        }
    </script>
</body>
</html>
