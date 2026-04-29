const CACHE_NAME = 'portman-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './assets/icon-192.png',
    './assets/icon-512.png'
];

// Instalación: Cachear archivos uno a uno para evitar que falle todo el proceso
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Instalando caché...');
            return Promise.all(
                ASSETS.map(url => {
                    return cache.add(url).catch(err => console.warn('No se pudo cachear:', url));
                })
            );
        })
    );
});

// Activación: Limpiar caches antiguos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// Fetch: Responder desde cache o red
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true })
            .then(response => {
                // Si lo encuentra en caché, lo sirve. Si no, intenta fetch.
                return response || fetch(event.request).catch(() => {
                    // Manejo silencioso del error de red en modo offline
                    return null;
                });
            })
    );
});
