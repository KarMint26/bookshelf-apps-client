const staticBookShelf = "bookshelf-v1";
const assets = [
  "/",
  "/index.html",
  "src/css/styles.css",
  "src/js/app.js",
  "src/assets/close.svg",
  "src/assets/create.svg",
  "src/assets/delete.svg",
  "src/assets/done.svg",
  "src/assets/icon.svg",
  "src/assets/preview.png",
  "src/assets/repeat.svg",
  "src/assets/search.svg",
  "src/assets/update.svg",
  "src/assets/manifest/icon-192x192.png",
  "src/assets/manifest/icon-256x256.png",
  "src/assets/manifest/icon-384x384.png",
  "src/assets/manifest/icon-512x512.png"
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticBookShelf).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});