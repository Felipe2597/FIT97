const CACHE = 'fit97-v8';
const FILES = ['./index.html', './style.css', './script.js', './library.js', './manifest.json', './icon.svg'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('fit97-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).catch(async () => {
    const cache = await caches.open(CACHE);
    return await cache.match(e.request) || (e.request.mode === 'navigate' ? await cache.match('./index.html') : null) || Response.error();
  }));
});
