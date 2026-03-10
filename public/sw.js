// Minimal service worker for PWA installability.
// You can extend this to add offline caching if desired.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});


