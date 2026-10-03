// Service Worker - Network First キャッシュ戦略
// GitHub Pages などサブパス配信でも動くよう、相対パスでキャッシュする
const CACHE_NAME = 'ga-site-cache-v7';

// キャッシュする静的アセット
const STATIC_ASSETS = [
    './',
    './index.html',
    './days.html',
    './baseball.html',
    './map.html',
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
    // 即座にアクティブ化
    self.skipWaiting();
});

// Service Worker アクティベート時：古いキャッシュを削除
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
    // 即座にクライアントを制御
    self.clients.claim();
});

// フェッチイベント：Network First 戦略
self.addEventListener('fetch', (event) => {
    // Supabase APIリクエストはキャッシュしない
    if (event.request.url.includes('supabase.co')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // ネットワーク成功時：GETのレスポンスをキャッシュに保存
                if (response.status === 200 && event.request.method === 'GET') {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // ネットワーク失敗時：キャッシュから返す
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // HTMLリクエストの場合はオフラインページを表示
                    const accept = event.request.headers.get('accept') || '';
                    if (accept.includes('text/html')) {
                        return caches.match('./offline.html');
                    }
                });
            })
    );
});
