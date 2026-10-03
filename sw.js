// Service Worker - Network First キャッシュ戦略（ありがとうサイト）
// 旧サイトのキャッシュ名と変えることで、切り替え時に古いキャッシュを確実に破棄する
const CACHE_NAME = 'ga-thanks-cache-v1';

// キャッシュする静的アセット
const STATIC_ASSETS = [
    './',
    './index.html',
    './offline.html',
    './manifest.json',
    './icon-192.svg',
    './icon-512.svg',
    './assets/css/style.css',
    './assets/js/site.js'
];

// Service Worker インストール時：静的アセットをキャッシュ
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// Service Worker アクティベート時：古いキャッシュ（旧サイト分含む）を削除
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// フェッチイベント：Network First 戦略
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (response.status === 200 && event.request.method === 'GET') {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    const accept = event.request.headers.get('accept') || '';
                    if (accept.includes('text/html')) {
                        return caches.match('./offline.html');
                    }
                });
            })
    );
});
