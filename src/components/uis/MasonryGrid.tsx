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
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 화면 크기에 따른 컬럼 수 계산
  const calculateColumns = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1280) return breakpoints.xl;
    if (width >= 1024) return breakpoints.lg;
    if (width >= 768) return breakpoints.md;
    return breakpoints.sm;
  }, [breakpoints]);

  // Masonry 레이아웃 적용
  const applyMasonryLayout = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    
    if (items.length === 0) return;

    // 컨테이너 너비 계산
    const containerWidth = container.offsetWidth;
    const itemWidth = (containerWidth - (columns - 1) * columnGap) / columns;
    
    // 각 컬럼의 현재 높이 추적
    const columnHeights = new Array(columns).fill(0);
    
    items.forEach((item, _index) => {
      // 가장 높이가 낮은 컬럼 찾기
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      
      // 아이템 위치 설정
      const x = shortestColumnIndex * (itemWidth + columnGap);
      const y = columnHeights[shortestColumnIndex];
      
      item.style.position = 'absolute';
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      item.style.width = `${itemWidth}px`;
      
      // 해당 컬럼 높이 업데이트
      columnHeights[shortestColumnIndex] += item.offsetHeight + rowGap;
    });
    
    // 컨테이너 높이 설정
    const maxHeight = Math.max(...columnHeights) - rowGap;
    container.style.height = `${maxHeight}px`;
  }, [columns, columnGap, rowGap]);

  // 리사이즈 이벤트 핸들러
  useEffect(() => {
    const handleResize = () => {
      const newColumns = calculateColumns();
      if (newColumns !== columns) {
        setColumns(newColumns);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columns, calculateColumns]);

  // 레이아웃 적용
  useEffect(() => {
    const timer = setTimeout(() => {
      applyMasonryLayout();
    }, 100); // 렌더링 완료 후 레이아웃 적용

    return () => clearTimeout(timer);
  }, [children, applyMasonryLayout]);

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full', className)}
    >
      {children.map((child, index) => (
        <div
          key={child.key || index}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          style={{ position: 'absolute' }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
