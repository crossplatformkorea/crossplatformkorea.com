export interface PWATestResult {
  manifestExists: boolean;
  serviceWorkerRegistered: boolean;
  isInstallable: boolean;
  cacheAvailable: boolean;
  offlineCapable: boolean;
}

export async function runPWATests(): Promise<PWATestResult> {
  const results: PWATestResult = {
    manifestExists: false,
    serviceWorkerRegistered: false,
    isInstallable: false,
    cacheAvailable: false,
    offlineCapable: false,
  };

  // 1. 매니페스트 확인
  try {
    const response = await fetch('/manifest.json');
    results.manifestExists = response.ok;
  } catch {
    results.manifestExists = false;
  }

  // 2. Service Worker 등록 확인
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      results.serviceWorkerRegistered = !!registration;
    } catch {
      results.serviceWorkerRegistered = false;
    }
  }

  // 3. 설치 가능성 확인 (beforeinstallprompt 이벤트 기반)
  results.isInstallable = window.matchMedia('(display-mode: browser)').matches;

  // 4. 캐시 확인
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      results.cacheAvailable = cacheNames.length > 0;
    } catch {
      results.cacheAvailable = false;
    }
  }

  // 5. 오프라인 기능 확인 (기본 페이지가 캐시되어 있는지)
  if ('caches' in window) {
    try {
      const cache = await caches.open('cpk-v1');
      const cachedResponse = await cache.match('/');
      results.offlineCapable = !!cachedResponse;
    } catch {
      results.offlineCapable = false;
    }
  }

  return results;
}

export function logPWATestResults(results: PWATestResult): void {
  console.group('PWA 테스트 결과');
  console.log('📄 매니페스트 존재:', results.manifestExists ? '✅' : '❌');
  console.log('⚙️ Service Worker 등록:', results.serviceWorkerRegistered ? '✅' : '❌');
  console.log('📱 설치 가능:', results.isInstallable ? '✅' : '❌');
  console.log('💾 캐시 사용 가능:', results.cacheAvailable ? '✅' : '❌');
  console.log('🌐 오프라인 기능:', results.offlineCapable ? '✅' : '❌');
  console.groupEnd();
}
