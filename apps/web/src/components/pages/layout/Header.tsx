import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe2 } from 'lucide-react';
import { SiDiscord } from '@icons-pack/react-simple-icons';
import { cn } from '@/lib/utils';
import { getLocale, setLocale } from '@/lib/i18n';
import { ThemeToggle } from '../../ThemeToggle';
import NotificationBell from '../../uis/NotificationBell';

export interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="relative z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/70 bg-card/90 px-3 backdrop-blur-xl sm:px-5">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <button
          id="sidebar-toggle"
          onClick={toggleSidebar}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-muted/80"
          aria-label={isSidebarOpen ? t('navigation.closeMenu') : t('navigation.openMenu')}
          aria-expanded={isSidebarOpen}
        >
          <span className="relative flex h-5 w-5 items-center justify-center" aria-hidden="true">
            <span
              className={cn(
                'hamburger-line hamburger-top absolute h-0.5 w-5 bg-foreground',
                isSidebarOpen && 'active',
              )}
            />
            <span
              className={cn(
                'hamburger-line hamburger-middle absolute h-0.5 w-5 bg-foreground',
                isSidebarOpen && 'active',
              )}
            />
            <span
              className={cn(
                'hamburger-line hamburger-bottom absolute h-0.5 w-5 bg-foreground',
                isSidebarOpen && 'active',
              )}
            />
          </span>
        </button>
        <Link
          to="/"
          aria-label={`${t('common.appName')} — ${t('navigation.home')}`}
          className="flex min-w-0 items-center gap-2.5"
        >
          <img src="/assets/logo.png" alt="" className="h-7 w-7 shrink-0 sm:h-8 sm:w-8" />
          <span className="hidden whitespace-nowrap text-xs font-bold tracking-tight sm:inline sm:text-base">
            {t('common.appName')}
          </span>
          <span className="text-sm font-bold sm:hidden">CPK</span>
        </Link>
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        <a
          href="https://discord.gg/XN53mmA9"
          target="_blank"
          rel="noopener noreferrer"
          className="mr-1 hidden items-center gap-2 rounded-lg border border-border/70 px-3 py-2 text-xs font-medium transition-colors hover:bg-muted/70 md:inline-flex"
        >
          <SiDiscord className="h-4 w-4" /> Discord{' '}
          <span className="text-muted-foreground">↗</span>
        </a>
        <NotificationBell />
        <ThemeToggle />
        <div className="relative flex items-center">
          <Globe2
            size={15}
            className="pointer-events-none absolute left-2 hidden text-muted-foreground sm:block"
            aria-hidden="true"
          />
          <select
            aria-label={t('navigation.language')}
            value={getLocale()}
            onChange={(event) => setLocale(event.target.value as 'en' | 'ko' | 'ja')}
            className="h-9 w-[76px] cursor-pointer rounded-lg border border-transparent bg-transparent pl-1.5 !pr-6 text-xs font-medium hover:bg-muted/70 sm:w-[106px] sm:pl-7"
          >
            <option value="en">English</option>
            <option value="ko">한국어</option>
            <option value="ja">日本語</option>
          </select>
        </div>
        <a
          href="https://github.com/crossplatformkorea"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-lg p-2 transition-colors hover:bg-muted/70 lg:inline-flex"
          aria-label="GitHub"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0C5.371 0 0 5.371 0 12c0 5.303 3.438 9.8 8.205 11.387.6.111.793-.261.793-.579v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.73.083-.73 1.205.084 1.84 1.258 1.84 1.258 1.07 1.834 2.809 1.305 3.495.998.108-.775.418-1.305.76-1.605-2.665-.305-5.467-1.333-5.467-5.933 0-1.311.469-2.381 1.235-3.221-.123-.303-.535-1.524.116-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.005.404 2.289-1.553 3.295-1.23 3.295-1.23.653 1.653.24 2.874.118 3.176.77.84 1.232 1.91 1.232 3.221 0 4.61-2.807 5.625-5.479 5.921.43.371.823 1.103.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.296 24 12 24 5.371 18.627 0 12 0z" />
          </svg>
        </a>
        <a
          href="https://www.youtube.com/@crossplatformkorea"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-lg p-2 transition-colors hover:bg-muted/70 lg:inline-flex"
          aria-label="YouTube"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
        </a>
      </div>
    </header>
  );
}
