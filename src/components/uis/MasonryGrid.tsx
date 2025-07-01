import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface MasonryGridProps {
  children: React.ReactElement[];
  className?: string;
  columnGap?: number;
  rowGap?: number;
  breakpoints?: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

const MasonryGrid: React.FC<MasonryGridProps> = ({
  children,
  className = '',
  columnGap = 24,
  rowGap = 24,
  breakpoints = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 3,
  },
}) => {
  const [columns, setColumns] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 화면 크기에 따른 컬럼 수 계산
  const calculateColumns = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1280) return breakpoints.xl;
    if (width >= 1024) return breakpoints.lg;
    if (width >= 768) return breakpoints.md;
    return breakpoints.sm;
  }, [breakpoints]);

  // 진짜 Pinterest 스타일 Masonry 레이아웃
  const applyMasonryLayout = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const items = Array.from(container.children) as HTMLElement[];

    if (items.length === 0) return;

    // 컨테이너를 relative positioning으로 설정
    container.style.position = 'relative';
    container.style.display = 'block';

    // 컨테이너 너비 계산
    const containerWidth = container.offsetWidth;
    const itemWidth = (containerWidth - (columns - 1) * columnGap) / columns;

    // 각 컬럼의 현재 높이 추적
    const columnHeights = new Array(columns).fill(0);

    // 모든 아이템을 순차적으로 배치
    items.forEach((item) => {
      // 아이템을 absolute positioning으로 설정
      item.style.position = 'absolute';
      item.style.width = `${itemWidth}px`;

      // 강제 리플로우로 정확한 높이 계산
      void item.offsetHeight;

      // 가장 높이가 낮은 컬럼 찾기
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

      // 위치 계산 및 설정
      const x = shortestColumnIndex * (itemWidth + columnGap);
      const y = columnHeights[shortestColumnIndex];

      item.style.left = `${x}px`;
      item.style.top = `${y}px`;

      // 컬럼 높이 업데이트 (실제 렌더링된 높이 사용)
      const itemHeight = item.offsetHeight;
      columnHeights[shortestColumnIndex] += itemHeight + rowGap;
    });

    // 컨테이너 높이를 가장 높은 컬럼에 맞춤
    const containerHeight = Math.max(...columnHeights) - rowGap;
    container.style.height = `${Math.max(containerHeight, 0)}px`;

    setIsReady(true);
  }, [columns, columnGap, rowGap]);

  // 이미지 로드 완료 대기
  const waitForImages = useCallback((): Promise<void> => {
    if (!containerRef.current) return Promise.resolve();

    const images = containerRef.current.querySelectorAll('img');
    if (images.length === 0) return Promise.resolve();

    return Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();

        return new Promise<void>((resolve) => {
          const handleLoad = () => {
            img.removeEventListener('load', handleLoad);
            img.removeEventListener('error', handleLoad);
            resolve();
          };

          img.addEventListener('load', handleLoad);
          img.addEventListener('error', handleLoad);
        });
      }),
    ).then(() => {});
  }, []);

  // 초기화
  useEffect(() => {
    const initialize = async () => {
      setIsReady(false);
      await waitForImages();

      // 이미지 로드 후 여러 번 레이아웃 적용으로 안정성 확보
      setTimeout(() => applyMasonryLayout(), 50);
      setTimeout(() => applyMasonryLayout(), 150);
      setTimeout(() => applyMasonryLayout(), 300);
    };

    void initialize();
  }, [children, waitForImages, applyMasonryLayout]);

  // 리사이즈 이벤트 핸들러
  useEffect(() => {
    const handleResize = () => {
      const newColumns = calculateColumns();
      setColumns(newColumns);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateColumns]);

  // 컬럼 수 변경 시 레이아웃 재계산
  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        applyMasonryLayout();
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [columns, applyMasonryLayout, isReady]);

  return (
    <div
      ref={containerRef}
      className={cn('w-full', className)}
      style={{
        minHeight: isReady ? undefined : '400px',
        opacity: isReady ? 1 : 0.3,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      {children}
    </div>
  );
};

export default MasonryGrid;
