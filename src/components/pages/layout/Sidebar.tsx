import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { cn } from '@/lib/utils';
import { sidebarItems } from '@/constants/sidebar';
import { LogIn, User, ChevronRight, X } from 'lucide-react';
import { Button } from '../../uis/Button';
import { t } from 'i18next';
import { useAuthStore } from '@/stores/authStore';

interface SidebarProps {
  isOpen?: boolean;
  isTransitioning?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  isOpen = false,
  isTransitioning = false,
  onClose,
}: SidebarProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [showContent, setShowContent] = useState(isOpen);

  // Get current user data with avatar and display name
  const userData = useQuery(api.users.query.currentUser);

  // Only show content when sidebar is fully open and not transitioning
  useEffect(() => {
    if (isOpen && !isTransitioning) {
      // Show content with a slight delay to ensure animation is complete
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      // Hide content immediately when closing starts
      setShowContent(false);
    }
  }, [isOpen, isTransitioning]);

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        'border-r h-full flex flex-col transition-all duration-300 relative',
        'bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800',
        'md:pt-0 pt-14', // Add padding top for mobile devices to prevent overlap
      )}
    >
      {/* Close button for mobile - only visible on mobile */}
      {onClose && (
        <div className="absolute top-0 left-0 right-0 h-14 md:hidden flex items-center justify-end px-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/95 dark:bg-zinc-900/95 backdrop-blur-sm z-10">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className={cn(
              'p-2 rounded-full bg-gray-200 dark:bg-zinc-800',
              'hover:bg-gray-300 dark:hover:bg-zinc-700 transition-colors',
              'flex items-center justify-center',
            )}
            aria-label={t('common.close')}
          >
            <X size={18} />
          </Button>
        </div>
      )}

      {/* Main navigation links */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            // Skip external links here - they'll be rendered at the bottom
            const isExternalLink = item.route.startsWith('http');
            if (isExternalLink) return null;
            
            return (
              <li key={item.key}>
                <Link
                  to={item.route}
                  className={cn(
                    'flex items-center py-3 px-4 transition-colors',
                    'hover:bg-gray-100 dark:hover:bg-zinc-800',
                    isActive(item.route)
                      ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground font-medium'
                      : 'text-gray-700 dark:text-zinc-300',
                  )}
                >
                  <div className="shrink-0">
                    <item.icon size={20} />
                  </div>
                  {showContent && (
                    <span className="ml-3 transition-opacity duration-150">{t(item.labelKey)}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* External links section - compact style */}
      {showContent && (
        <div className="px-4 pb-2">
          <div className="space-y-1">
            {sidebarItems
              .filter(item => item.route.startsWith('http'))
              .map((item) => (
                <a
                  key={item.key}
                  href={item.route}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center py-2 px-2 rounded-md transition-colors text-xs',
                    'hover:bg-gray-100 dark:hover:bg-zinc-800',
                    'text-gray-600 dark:text-zinc-400',
                  )}
                >
                  <div className="shrink-0">
                    <item.icon size={14} />
                  </div>
                  <span className="ml-2 transition-opacity duration-150">{t(item.labelKey)}</span>
                </a>
              ))}
          </div>
        </div>
      )}

      {/* Login button at the bottom */}
      <div
        className={cn(
          'border-t border-gray-200 dark:border-zinc-800 mt-auto',
          showContent ? 'p-4' : 'p-0', // Adjust padding
        )}
      >
        {!isAuthenticated ? (
          <Link
            to="/sign-in"
            className={cn(
              'flex items-center py-2 px-3 rounded-md transition-colors',
              // 라이트모드 스타일
              'bg-gradient-to-r from-primary/70 to-primary/80 text-primary-foreground',
              'hover:from-primary/80 hover:to-primary/90',
              // 다크모드 스타일 - 더 밝게 조정
              'dark:from-primary/85 dark:to-primary/95',
              'dark:text-primary-foreground',
              'dark:hover:from-primary/90 dark:hover:to-primary/100',
              !showContent && 'hidden', // Hide completely when sidebar is collapsed
            )}
          >
            <LogIn size={18} />
            {showContent && (
              <span className="ml-2 transition-opacity duration-150">{t('common.signIn')}</span>
            )}
          </Link>
        ) : (
          <Link
            to="/profile"
            className={cn(
              'flex items-center py-2 px-3 rounded-md transition-colors w-full',
              'bg-primary/10 text-primary hover:bg-primary/20',
              'dark:bg-primary/20 dark:text-white dark:hover:bg-primary/30',
              !showContent && 'hidden', // Hide completely when sidebar is collapsed
            )}
          >
            {/* User avatar or default icon */}
            {userData?.avatarUrl ? (
              <img
                src={userData.avatarUrl}
                alt={userData.displayName || t('common.profile')}
                className="w-6 h-6 rounded-full object-cover border border-transparent dark:border-zinc-700"
              />
            ) : (
              <User size={18} className="text-primary dark:text-white" />
            )}

            {/* Show displayName with truncation when sidebar is open */}
            {showContent && (
              <div className="flex-1 flex items-center justify-between ml-2">
                <span
                  className={cn(
                    'transition-opacity duration-150 truncate max-w-[100px]',
                    'text-slate-700 dark:text-gray-100', // Updated text color for light mode
                  )}
                >
                  {userData?.displayName || t('common.profile')}
                </span>
                <ChevronRight size={16} className="ml-1 text-primary/70 dark:text-white/70" />
              </div>
            )}
          </Link>
        )}
      </div>
    </aside>
  );
}
