<!DOCTYPE html>
<html lang="fr" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Connexion - Revenue Counter</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <!-- PWA Manifest & Meta -->
    <meta name="theme-color" content="#1E3A8A">
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/icons/icon-192x192.png">
</head>
<body class="h-full bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <!-- Logo municipal -->
        <div class="text-center mb-6">
            <h1 class="text-2xl font-bold text-blue-900 tracking-tight">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h1>
            <p class="text-xs uppercase tracking-widest text-gray-500 font-semibold mt-1">Ville de Lubumbashi — Commune de la Kenya</p>
            <div class="mt-4 inline-block bg-blue-900 text-white font-bold px-3 py-1 text-xs rounded">
                REVENUE COUNTER
            </div>
        </div>

        <!-- Notification messages -->
        @if (session('success'))
            <div class="mb-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded-md p-3">
                {{ session('success') }}
            </div>
        @endif

        @if (session('error'))
            <div class="mb-4 bg-red-50 border border-red-200 text-red-800 text-sm rounded-md p-3">
                {{ session('error') }}
            </div>
        @endif

        @yield('content')
    </div>

    <!-- Register PWA Service Worker -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js')
                    .then(reg => console.log('Service Worker enregistré !', reg.scope))
                    .catch(err => console.log('Échec de l\'enregistrement du Service Worker', err));
            });
        }
    </script>
</body>
</html>
