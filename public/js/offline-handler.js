document.addEventListener('DOMContentLoaded', function() {
    const badge = document.getElementById('connection-status-badge');
    const dot = document.getElementById('connection-status-dot');
    const text = document.getElementById('connection-status-text');
    const syncBtn = document.getElementById('manual-sync-btn');
    const syncBadgeCount = document.getElementById('offline-count-badge');
    const syncStatusContainer = document.getElementById('sync-status-container');
    const syncStatusText = document.getElementById('sync-status-text');

    // Update connection status display
    function updateOnlineStatus() {
        const isOnline = navigator.onLine;

        if (isOnline) {
            // Online State styles (Success green)
            badge.className = "inline-flex items-center px-3 py-1 rounded-[6px] text-xs font-bold select-none border shadow-sm transition-all duration-300 bg-green-50 border-green-200 text-green-800";
            dot.className = "h-2 w-2 rounded-full mr-2 bg-green-600 animate-pulse";
            text.textContent = "En Ligne";
            
            // Trigger auto-sync if there are queued transactions
            triggerOfflineSync();
        } else {
            // Offline State styles (Warning orange/red)
            badge.className = "inline-flex items-center px-3 py-1 rounded-[6px] text-xs font-bold select-none border shadow-sm transition-all duration-300 bg-red-50 border-red-200 text-red-800";
            dot.className = "h-2 w-2 rounded-full mr-2 bg-red-600";
            text.textContent = "Hors Ligne (Terrain)";
        }
        
        updateSyncButtonVisibility();
    }

    // Update sync button display based on localStorage queue
    function updateSyncButtonVisibility() {
        const queue = JSON.parse(localStorage.getItem('offline_payments') || '[]');
        if (queue.length > 0) {
            syncBadgeCount.textContent = queue.length;
            if (navigator.onLine) {
                syncBtn.classList.remove('hidden');
                syncBtn.classList.add('flex');
            } else {
                // Cannot sync while offline
                syncBtn.classList.add('hidden');
                syncBtn.classList.remove('flex');
            }
        } else {
            syncBtn.classList.add('hidden');
            syncBtn.classList.remove('flex');
        }
    }

    // Auto-sync process when online
    function triggerOfflineSync() {
        const queue = JSON.parse(localStorage.getItem('offline_payments') || '[]');
        if (queue.length === 0) return;

        // Display synchronization overlay loader
        syncStatusContainer.classList.remove('hidden');
        syncStatusText.textContent = `Synchronisation de ${queue.length} collecte(s) en cours...`;

        // Fetch CSRF Token
        const tokenMeta = document.querySelector('meta[name="csrf-token"]');
        const token = tokenMeta ? tokenMeta.getAttribute('content') : '';

        fetch('/api/paiement/sync-offline', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
                'Accept': 'application/json'
            },
            body: JSON.stringify({ payments: queue })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Sync result: ', data);
            
            const results = data.results || { success: [], errors: [] };
            
            // Clear successfully synced items
            const successLocalIds = results.success.map(s => s.local_id);
            const remainingQueue = queue.filter(item => !successLocalIds.includes(item.local_id));
            
            localStorage.setItem('offline_payments', JSON.stringify(remainingQueue));
            
            // UI Feedback
            if (results.errors.length === 0) {
                syncStatusText.textContent = `Synchronisation réussie ! ${results.success.length} reçus envoyés au serveur.`;
                setTimeout(() => {
                    syncStatusContainer.classList.add('hidden');
                    window.location.reload(); // Refresh stats on dashboard
                }, 3000);
            } else {
                syncStatusText.textContent = `Synchro partielle : ${results.success.length} réussis, ${results.errors.length} en erreur.`;
                setTimeout(() => {
                    syncStatusContainer.classList.add('hidden');
                }, 5000);
            }

            updateSyncButtonVisibility();
        })
        .catch(err => {
            console.error('Failed to sync: ', err);
            syncStatusText.textContent = "Erreur de connexion. Nouvelle tentative ultérieure.";
            setTimeout(() => {
                syncStatusContainer.classList.add('hidden');
            }, 3000);
        });
    }

    // Listen to network changes
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Listen to custom local payment additions
    window.addEventListener('offline-payment-added', updateSyncButtonVisibility);

    // Manual sync button trigger
    syncBtn.addEventListener('click', triggerOfflineSync);

    // Initial check
    updateOnlineStatus();
});
