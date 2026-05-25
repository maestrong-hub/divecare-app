// DIVECARE Service Worker v2 — 캐시 강제 갱신
const CACHE = 'divecare-v2';
const FILES = ['/divecare-app/', '/divecare-app/index.html', '/divecare-app/manifest.json'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES);}));
  self.skipWaiting();
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e){
  e.respondWith(fetch(e.request).then(function(r){
    var clone=r.clone();
    caches.open(CACHE).then(function(c){c.put(e.request,clone);});
    return r;
  }).catch(function(){
    return caches.match(e.request);
  }));
});
