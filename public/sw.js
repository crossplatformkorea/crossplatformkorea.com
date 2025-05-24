const CACHE_NAME = 'cpk-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/showcases',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// 캐시 가능한 요청인지 확인하는 함수
function isCacheable(request) {
  try {
    const url = new URL(request.url);

    // 브라우저 확장 프로그램 스킴 제외
    if (
      url.protocol === 'chrome-extension:' ||
      url.protocol === 'moz-extension:' ||
      url.protocol === 'ms-browser-extension:' ||
      url.protocol === 'safari-extension:' ||
      url.protocol === 'edge-extension:'
    ) {
      return false;
    }

    // http, https가 아닌 경우 제외
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return false;
    }

    // GET 요청만 캐시
    if (request.method !== 'GET') {
      return false;
    }

    // 개발 서버 관련 요청 제외
    if (
      url.pathname.includes('/@vite/') ||
      url.pathname.includes('/__vite_ping') ||
      url.pathname.includes('/@fs/') ||
      url.pathname.includes('/node_modules/') ||
      url.searchParams.has('token') ||
      url.searchParams.has('import') ||
      url.pathname.endsWith('.ts') ||
      url.pathname.endsWith('.tsx') ||
      url.pathname.endsWith('.jsx')
    ) {
      return false;
    }

    // API 요청 제외 (필요에 따라 조정)
    if (url.pathname.startsWith('/api/')) {
      return false;
    }

    // WebSocket 요청 제외
    if (url.protocol === 'ws:' || url.protocol === 'wss:') {
      return false;
    }

    // 현재 도메인이 아닌 경우에는 신중하게 처리
    if (url.hostname !== self.location.hostname && url.hostname !== 'localhost') {
      return false;
    }

    return true;
  } catch (error) {
    console.log('Error checking cacheable:', error);
    return false;
  }
}

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('SW installing...');
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static resources...');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Static resources cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.log('Cache install failed:', error);
      }),
  );
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('SW activating...');
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log('SW activated');
        return self.clients.claim();
      }),
  );
});

// 패치 이벤트 - 네트워크 우선, 캐시 폴백 전략
self.addEventListener('fetch', (event) => {
  // 캐시할 수 없는 요청은 그냥 네트워크로 전달
  if (!isCacheable(event.request)) {
    return; // 아무것도 하지 않고 브라우저가 기본 처리하도록 함
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 성공적인 응답만 캐시에 저장
        if (response && response.status === 200 && response.type === 'basic') {
          try {
            const responseClone = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              })
              .catch((error) => {
                console.log('Cache put failed:', error);
              });
          } catch (error) {
            console.log('Response clone failed:', error);
          }
        }
        return response;
      })
      .catch((error) => {
        console.log('Fetch failed, trying cache:', error);
        // 네트워크 실패시 캐시에서 응답
        return caches.match(event.request);
      }),
  );
});
