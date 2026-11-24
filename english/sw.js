/* 人人都能用英语 offline cache */
const VERSION = "ecue-v1";
self.addEventListener("install", (e) => e.waitUntil(caches.open(VERSION).then((c) => c.addAll(["./", "./index.html", "./manifest.webmanifest", "./icon.svg"])).then(() => self.skipWaiting())));
self.addEventListener("activate", (e) => e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { if (res.ok && res.type === "basic") { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); } return res; })));
});
