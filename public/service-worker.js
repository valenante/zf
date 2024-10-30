/* eslint-disable no-restricted-globals */

// public/service-worker.js

const CACHE_NAME = 'v1';
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
];

// Instalar el service worker y cachear los activos
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app shell');
      return cache.addAll(CACHE_ASSETS);
    })
  );
});

// Activar el service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interceptar las solicitudes de red
self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Manejo de notificaciones (opcional)
self.addEventListener('push', (event) => {
  const title = 'Nueva Notificación';
  const options = {
    body: event.data ? event.data.text() : 'Sin contenido.',
    icon: '/logo192.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
