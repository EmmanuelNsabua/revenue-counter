const CACHE_NAME = 'revenue-counter-v1';
const ASSETS = [
    '/',
    '/login',
    '/js/offline-handler.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (e) => {
    // Check if the request is for assets or local pages to cache
    const url = new URL(e.request.url);
    
    // For POST requests (like submitting payments), we pass them through
    if (e.request.method === 'POST') {
        return;
    }

    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Return cached asset, fetch updated in background (stale-while-revalidate)
                fetch(e.request).then((networkResponse) => {
                    if (networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
                    }
                }).catch(() => {/* Ignore network errors offline */});
                return cachedResponse;
            }

            return fetch(e.request).then((response) => {
                // Cache any newly requested static assets (CSS/JS compiled by Vite)
                if (response.status === 200 && (url.pathname.includes('/build/') || url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || url.pathname.endsWith('.png'))) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
                }
                return response;
            }).catch(() => {
                // If page fetch fails (e.g. offline navigating to /paiement/create)
                // we return the cached main '/' layout or cached '/login'
                if (e.request.mode === 'navigate') {
                    return caches.match('/login') || caches.match('/');
                }
            });
        })
    );
});
