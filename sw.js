const CACHE = 'wc2026-v4';
const APP_SHELL = [
  './wc2026_dashboard.html',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './manifest.json',
  './splash-1170x2532.png',
  './splash-1179x2556.png',
  './splash-1290x2796.png',
  './splash-1206x2622.png',
  './splash-1320x2868.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // API calls: network-only, don't cache ESPN/Fotmob responses
  if (url.origin !== location.origin) return;

  // App shell: network-first with cache fallback
  e.respondWith(
    fetch(e.request).then(r => {
      const clone = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
