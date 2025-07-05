import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getLocale, setLocale, t } from '@/lib/i18n';
import { ThemeToggle } from '../../ThemeToggle';
import NotificationBell from '../../uis/NotificationBell';
import { SiSlack } from '@icons-pack/react-simple-icons';

export interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSelectedSection?: (section: string) => void;
  selectedSection?: string;
}

export function Header({
  isSidebarOpen,
  toggleSidebar,
  setSelectedSection,
  selectedSection = 'Posts',
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Set Posts as the default selected section when component mounts or when on home path
  useEffect(() => {
    if (setSelectedSection) {
      // Set Posts as selected when on the home path
      if (location.pathname === '/') {
        setSelectedSection('Posts');
      } else if (!selectedSection) {
        // Set default selection for other paths if none is selected
        setSelectedSection('Posts');
      }
    }
  }, [setSelectedSection, selectedSection, location.pathname]);

  const [currentLocale, setCurrentLocale] = useState<'en' | 'ko' | 'ja'>(getLocale());
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        // Base layout
        'h-16 flex-shrink-0 flex items-center justify-between px-2 sm:px-4 relative z-10',
        // Visual styling
        'border-b border-border/30',
        'bg-gradient-to-r from-background via-background to-background backdrop-blur-sm',
      )}
    >
      <div className="flex items-center gap-1 sm:gap-3">
        {' '}
        {/* 모바일에서 간격 줄임 */}
        {/* Hamburger menu button */}{' '}
        <button
          onClick={toggleSidebar}
          className="p-1.5 sm:p-2 rounded-md hover:bg-muted/80 transition-colors mr-0.5 sm:mr-1 flex flex-col justify-center items-center w-9 sm:w-10 h-9 sm:h-10"
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <div className="relative h-5 w-5 flex flex-col justify-center items-center">
            <span
              className={cn(
                'absolute w-5 h-0.5 bg-foreground hamburger-line hamburger-top',
                isSidebarOpen ? 'active' : '',
              )}
            ></span>
            <span
              className={cn(
                'absolute w-5 h-0.5 bg-foreground hamburger-line hamburger-middle',
                isSidebarOpen ? 'active' : '',
              )}
            ></span>
            <span
              className={cn(
                'absolute w-5 h-0.5 bg-foreground hamburger-line hamburger-bottom',
                isSidebarOpen ? 'active' : '',
              )}
            ></span>
          </div>
        </button>
        {/* Logo and title */}
        <div
          className="flex cursor-pointer items-center gap-1.5 sm:gap-3"
          onClick={() => {
            void navigate('/');
          }}
        >
          <img src="/assets/logo.png" alt={t('common.appName')} className="h-7 sm:h-8 w-auto" />
          <div className="overflow-hidden">
            <h1 className="text-sm md:text-base lg:text-xl font-bold tracking-tight truncate max-w-[120px] sm:max-w-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                {t('common.appName')}
              </span>
            </h1>
          </div>
        </div>
      </div>{' '}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-4 mr-2">
          <a
            href="http://hyo.dev/joinCPK"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'font-medium text-sm px-3 py-2 rounded-md transition-colors flex items-center gap-2',
              'bg-primary/10 text-primary',
              'dark:bg-primary/10 dark:text-white',
            )}
          >
            <SiSlack className="w-4 h-4" />
            Slack
          </a>
        </nav>{' '}
        {/* Auth & Language Controls */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Notification Bell */}
          <NotificationBell />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Selector - Hidden on small screens */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className={cn(
                'flex items-center text-sm font-medium px-2 py-1 rounded-md transition-colors',
                'hover:bg-muted dark:hover:bg-muted',
              )}
            >
              {currentLocale === 'en' ? 'English' : currentLocale === 'ko' ? '한국어' : '日本語'}
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {langMenuOpen && (
              <div
                className={cn(
                  'absolute right-0 mt-2 w-32 rounded-md shadow-lg z-10',
                  'bg-background dark:bg-secondary',
                  'backdrop-blur-md border border-border/50',
                )}
              >
                {['en', 'ko', 'ja'].map((code) => (
                  <div
                    key={code}
                    onClick={() => {
                      setLocale(code as 'en' | 'ko' | 'ja');
                      setCurrentLocale(code as 'en' | 'ko' | 'ja');
                      setLangMenuOpen(false);
                      // reload to apply translations globally
                      window.location.reload();
                    }}
                    className={cn(
                      'px-4 py-2 text-sm cursor-pointer',
                      'hover:bg-muted dark:hover:bg-muted',
                    )}
                  >
                    {code === 'en' ? 'English' : code === 'ko' ? '한국어' : '日本語'}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* YouTube Link */}
          <a
            href="https://www.youtube.com/@crossplatformkorea"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'p-1.5 sm:p-2 rounded-md transition-colors',
              'hover:bg-muted dark:hover:bg-muted',
            )}
            aria-label="YouTube Channel"
          >
            <svg
              className={cn('w-4 h-4 sm:w-5 sm:h-5 text-foreground', 'dark:text-foreground')}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
            </svg>
          </a>

          {/* GitHub Link */}
          <a
            href="https://github.com/crossplatformkorea"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:p-2 rounded-md hover:bg-muted dark:hover:bg-muted transition-colors"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-foreground dark:text-foreground"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 0C5.371 0 0 5.371 0 12c0 5.303 3.438 9.8 8.205 11.387.6.111.793-.261.793-.579v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.73.083-.73 1.205.084 1.84 1.258 1.84 1.258 1.07 1.834 2.809 1.305 3.495.998.108-.775.418-1.305.76-1.605-2.665-.305-5.467-1.333-5.467-5.933 0-1.311.469-2.381 1.235-3.221-.123-.303-.535-1.524.116-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.005.404 2.289-1.553 3.295-1.23 3.295-1.23.653 1.653.24 2.874.118 3.176.77.84 1.232 1.91 1.232 3.221 0 4.61-2.807 5.625-5.479 5.921.43.371.823 1.103.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.296 24 12 24 5.371 18.627 0 12 0z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
      {/* Apply the styles using standard CSS classes instead of jsx prop */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hamburger-line {
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .hamburger-top {
          transform: translateY(-5px);
        }
        .hamburger-top.active {
          transform: translateY(0) rotate(45deg);
        }
        .hamburger-middle {
          transform: translateY(0);
        }
        .hamburger-middle.active {
          opacity: 0;
        }
        .hamburger-bottom {
          transform: translateY(5px);
        }
        .hamburger-bottom.active {
          transform: translateY(0) rotate(-45deg);
        }

        /* Sidebar navigation styling for dark mode */
        .dark nav a.bg-primary\\/10 {
          color: white !important;
        }
        .dark nav a:not(.bg-primary\\/10) {
          color: rgba(255, 255, 255, 0.8) !important;
        }
        .dark nav a:hover:not(.bg-primary\\/10) {
          color: white !important;
        }
      `,
        }}
      />
    </header>
  );
}
