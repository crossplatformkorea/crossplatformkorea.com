import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AppWindow, ExternalLink, Tag, Edit, User, ChevronDown } from 'lucide-react';
import { Button } from '../../uis/Button';
import { cn } from '@/lib/utils';
import { Doc } from '../../../../convex/_generated/dataModel';
import { useTranslation } from 'react-i18next';
import LikeButton from '../../uis/LikeButton';

// ShowcaseItem 타입 정의
export type ShowcaseItemType = Doc<'showcases'> & {
  categoryName?: string;
  otherLinks?: string | string[]; // Make sure otherLinks can be either string or string array
  author?: {
    _id: string;
    name: string;
    avatarUrl?: string;
  };
};

interface ShowcaseItemProps {
  showcase: ShowcaseItemType;
  isEditable?: boolean;
  onEditClick?: () => void;
  className?: string;
}

const ShowcaseItem = ({ showcase, isEditable, onEditClick, className = '' }: ShowcaseItemProps) => {
  const { t } = useTranslation();
  const [showOtherLinksDropdown, setShowOtherLinksDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Other Links 파싱 헬퍼 함수
  const parseOtherLinks = (otherLinks: string | string[] | undefined): string[] => {
    if (!otherLinks) return [];
    if (typeof otherLinks === 'string') {
      return otherLinks.split(',').map(link => link.trim()).filter(Boolean);
    }
    if (Array.isArray(otherLinks)) {
      return otherLinks.filter(Boolean);
    }
    return [];
  };

  const otherLinksArray = parseOtherLinks(showcase.otherLinks);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowOtherLinksDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:shadow-md',
        'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        className,
      )}
    >
      {/* 이미지 영역 */}
      <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        {showcase.imageUrl ? (
          <img
            src={showcase.imageUrl}
            alt={showcase.title}
            className="w-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-48 items-center justify-center bg-gray-100 dark:bg-gray-700">
            <AppWindow size={48} className="text-gray-400 dark:text-gray-500" />
          </div>
        )}

        {/* 추천 뱃지 */}
        {showcase.featured && (
          <span
            className={cn(
              'absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium text-white',
              'bg-gray-600 dark:bg-gray-500',
            )}
          >
            {t('showcase.featured')}
          </span>
        )}
      </div>

      {/* 컨텐츠 영역 */}
      <div className="p-4">
        {/* 카테고리 & 편집 버튼 */}
        <div className="mb-2 flex items-center justify-between">
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-xs font-medium',
              'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
            )}
          >
            {showcase.categoryName || showcase.category}
          </span>

          {isEditable && (
            <Button
              onClick={onEditClick}
              variant="ghost"
              size="icon"
              className={cn(
                'rounded-md p-1 transition-colors h-auto w-auto',
                'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
              )}
              title="Edit"
            >
              <Edit size={16} />
            </Button>
          )}
        </div>

        {/* 제목 - 링크 제거 */}
        <h3
          className={cn(
            'mb-2 line-clamp-1 text-lg font-semibold',
            'text-gray-800 dark:text-gray-100',
          )}
        >
          {showcase.title}
        </h3>

        {/* 설명 */}
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
          {showcase.description}
        </p>

        {/* 링크 영역 */}
        <div className="mb-3 flex flex-wrap gap-2">
          {showcase.websiteUrl && (
            <a
              href={showcase.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors',
                'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                'hover:bg-gray-300 dark:hover:bg-gray-600',
              )}
            >
              <ExternalLink size={12} />
              <span>{t('showcase.website')}</span>
            </a>
          )}

          {/* App Store와 Play Store는 website가 있을 때만 배지로 표시 */}
          {showcase.websiteUrl && (showcase.appStoreUrl || showcase.playStoreUrl) && (
            <div className="flex gap-1">
              {showcase.appStoreUrl && (
                <a
                  href={showcase.appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors',
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
                    'hover:bg-blue-200 dark:hover:bg-blue-900/50',
                  )}
                >
                  {t('showcase.appStore')}
                </a>
              )}
              
              {showcase.playStoreUrl && (
                <a
                  href={showcase.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors',
                    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
                    'hover:bg-green-200 dark:hover:bg-green-900/50',
                  )}
                >
                  {t('showcase.playStore')}
                </a>
              )}
            </div>
          )}

          {/* Other Links 드롭다운 표시 (website가 있을 때만 배지로) */}
          {showcase.websiteUrl && otherLinksArray.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowOtherLinksDropdown(!showOtherLinksDropdown)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors',
                  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
                  'hover:bg-purple-200 dark:hover:bg-purple-900/50',
                )}
              >
                {t('showcase.otherLinksButton')} ({otherLinksArray.length})
                <ChevronDown size={8} className={cn(
                  'transition-transform',
                  showOtherLinksDropdown && 'rotate-180'
                )} />
              </button>
              
              {/* 드롭다운 메뉴 */}
              {showOtherLinksDropdown && (
                <div className={cn(
                  'absolute left-0 top-full mt-1 z-10 min-w-48 rounded-md border shadow-lg',
                  'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
                )}>
                  <div className="p-2 max-h-32 overflow-y-auto">
                    {otherLinksArray.map((link, idx) => {
                      const cleanUrl = link.trim();
                      const displayText = cleanUrl.replace(/^https?:\/\//, '').split('/')[0].split('?')[0];
                      
                      return (
                        <a
                          key={idx}
                          href={cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            'block px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-700',
                            'text-gray-700 dark:text-gray-300 transition-colors'
                          )}
                          title={cleanUrl}
                          onClick={() => setShowOtherLinksDropdown(false)}
                        >
                          <div className="flex items-center gap-1">
                            <ExternalLink size={10} />
                            <span className="truncate">
                              {displayText.length > 25 ? `${displayText.slice(0, 25)}...` : displayText}
                            </span>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* website가 없을 때는 첫 번째 Other Link를 기존 방식으로 표시 */}
          {!showcase.websiteUrl && otherLinksArray.length > 0 && (
            <a
              href={otherLinksArray[0].startsWith('http') ? otherLinksArray[0] : `https://${otherLinksArray[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors',
                'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                'hover:bg-gray-300 dark:hover:bg-gray-600',
              )}
            >
              <ExternalLink size={12} />
              <span>{t('showcase.linkLabel')}</span>
            </a>
          )}

          {/* website가 없을 때는 기존 방식으로 표시 */}
          {!showcase.websiteUrl && showcase.appStoreUrl && (
            <a
              href={showcase.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors',
                'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                'hover:bg-gray-300 dark:hover:bg-gray-600',
              )}
            >
              <ExternalLink size={12} />
              <span>{t('showcase.appStore')}</span>
            </a>
          )}

          {!showcase.websiteUrl && showcase.playStoreUrl && (
            <a
              href={showcase.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors',
                'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                'hover:bg-gray-300 dark:hover:bg-gray-600',
              )}
            >
              <ExternalLink size={12} />
              <span>{t('showcase.playStore')}</span>
            </a>
          )}
        </div>

        {/* 태그 영역 */}
        {showcase.tags && showcase.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {showcase.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className={cn(
                  'inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px]',
                  'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
                )}
              >
                <Tag size={8} className="mr-0.5" />
                {tag}
              </span>
            ))}
            {showcase.tags.length > 3 && (
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                +{showcase.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 작성자 정보 + 좋아요 버튼 우측 정렬 */}
        <div
          className={cn(
            'mt-4 flex items-center pt-2 text-xs justify-between',
            'border-t border-gray-200 dark:border-gray-700',
            'text-gray-500 dark:text-gray-400',
          )}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {showcase.author?._id ? (
              <Link 
                to={`/user/${showcase.author._id}`}
                className="flex items-center gap-1.5 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {showcase.author.avatarUrl ? (
                  <img
                    src={showcase.author.avatarUrl}
                    alt={showcase.author.name}
                    className="h-4 w-4 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                  />
                ) : (
                  <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                    <User size={10} className="text-gray-100 dark:text-gray-800" />
                  </div>
                )}
                <span className="truncate max-w-[100px]">
                  {showcase.author.name || t('showcase.user')}
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                  <User size={10} className="text-gray-100 dark:text-gray-800" />
                </div>
                <span className="truncate max-w-[100px]">
                  {t('showcase.user')}
                </span>
              </div>
            )}
          </div>
          <LikeButton
            postId={showcase._id}
            type="showcases"
            showCount={true}
            size="sm"
            className="!px-2 !py-1 ml-2"
          />
        </div>
      </div>
    </div>
  );
};

export default ShowcaseItem;
