import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Précache des ressources statiques
precacheAndRoute(self.__WB_MANIFEST);

// Stratégie pour les pages HTML
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
      }),
    ],
  })
);

// Stratégie pour les assets statiques
registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// Stratégie pour les images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
      }),
    ],
  })
);

// Gestion de la synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-activities') {
    event.waitUntil(syncActivities());
  }
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir les détails',
        icon: '/icons/checkmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('OffTrack', options)
  );
});

// Fonction de synchronisation des activités
async function syncActivities() {
  try {
    const db = await openDB();
    const activities = await db.getAll('activities');
    
    // Ici, nous implémenterons la logique de synchronisation avec le serveur
    // Une fois que nous aurons défini l'API backend
    
    return Promise.resolve();
  } catch (error) {
    console.error('Erreur de synchronisation:', error);
    return Promise.reject(error);
  }
} 