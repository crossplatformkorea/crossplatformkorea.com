import { useState, useEffect } from 'react';
import { usePWA } from '../../hooks/usePWA';
import { cn } from '../../lib/utils';
import { Button } from '@/components/uis/Button';

export default function PWATestPanel() {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheStatus, setCacheStatus] = useState<string>('checking');

  useEffect(() => {
    // Service Worker 등록 상태 확인
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.getRegistration().then((registration) => {
        setSwRegistration(registration || null);
      });
    }

    // 온라인/오프라인 상태 감지
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 캐시 상태 확인
    void checkCacheStatus();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkCacheStatus = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        setCacheStatus(cacheNames.length > 0 ? 'available' : 'empty');
      } catch {
        setCacheStatus('error');
      }
    } else {
      setCacheStatus('not_supported');
    }
  };

  const clearCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        setCacheStatus('empty');
        alert('캐시가 클리어되었습니다.');
      } catch {
        alert('캐시 클리어 중 오류가 발생했습니다.');
      }
    }
  };

  const testOfflineMode = () => {
    // 네트워크 연결을 시뮬레이션하기 위한 테스트
    window.location.reload();
  };

  return (
    <div className="space-y-4 text-sm">
      {/* 상태 표시 */}
      <div className="space-y-3">
        {/* 설치 상태 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-300">설치 가능:</span>
          <span className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            isInstallable ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
          )}>
            {isInstallable ? '예' : '아니오'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-300">설치됨:</span>
          <span className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            isInstalled ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
          )}>
            {isInstalled ? '예' : '아니오'}
          </span>
        </div>

        {/* Service Worker 상태 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Service Worker:</span>
          <span className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            swRegistration ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          )}>
            {swRegistration ? '등록됨' : '미등록'}
          </span>
        </div>

        {/* 네트워크 상태 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-300">네트워크:</span>
          <span className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            isOnline ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'
          )}>
            {isOnline ? '온라인' : '오프라인'}
          </span>
        </div>

        {/* 캐시 상태 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-300">캐시:</span>
          <span className={cn(
            'px-2 py-1 rounded text-xs font-medium',
            cacheStatus === 'available' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
          )}>
            {cacheStatus === 'available' ? '사용가능' : 
             cacheStatus === 'empty' ? '비어있음' : 
             cacheStatus === 'error' ? '오류' : '확인중'}
          </span>
        </div>
      </div>

      {/* 테스트 버튼들 */}
      <div className="space-y-3 pt-4 border-t border-gray-700">
        {isInstallable && (
          <Button
            onClick={() => void installApp()}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            앱 설치 테스트
          </Button>
        )}
        
        <Button
          onClick={() => void checkCacheStatus()}
          className="w-full px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          캐시 상태 새로고침
        </Button>
        
        <Button
          onClick={() => void clearCache()}
          className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          캐시 클리어
        </Button>
        
        <Button
          onClick={testOfflineMode}
          className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          오프라인 모드 테스트
        </Button>
      </div>
    </div>
  );
}
