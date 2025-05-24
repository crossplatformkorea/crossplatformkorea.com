import { useState } from 'react';
import { Settings, Terminal, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import PWATestPanel from './PWATestPanel';
import { Button } from '@/components/uis/Button';

export default function DevPanel() {
  const [isOpen, setIsOpen] = useState(false);

  // 개발 모드에서만 표시
  if (import.meta.env.MODE === 'production') {
    return null;
  }

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 사이드 패널 */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50',
          'transform transition-transform duration-300 ease-in-out',
          'border-l border-gray-700',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Settings size={16} />
            <span className="text-sm font-semibold">Dev Panel</span>
          </div>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="p-1 rounded hover:bg-gray-700"
          >
            <X size={16} />
          </Button>
        </div>

        {/* 패널 내용 */}
        <div className="p-4 h-[calc(100vh-80px)] overflow-y-auto">
          <div className="space-y-4">
            {/* PWA 테스트 섹션 */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-300 border-b border-gray-700 pb-2">
                PWA 테스트
              </h3>
              <PWATestPanel />
            </div>

            {/* 추가 개발 도구들을 여기에 넣을 수 있음 */}
            <div className="pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-400">개발 모드 ({import.meta.env.MODE})</p>
            </div>
          </div>
        </div>
      </div>

      {/* 토글 버튼 - 오른쪽 아래에 배치 */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className={cn(
            'fixed bottom-4 right-4 z-40',
            'flex items-center justify-center',
            'w-12 h-12 bg-gray-900 text-white shadow-lg',
            'rounded-lg border border-gray-700',
            'hover:bg-gray-800',
          )}
        >
          <Terminal size={18} />
        </Button>
      )}
    </>
  );
}
