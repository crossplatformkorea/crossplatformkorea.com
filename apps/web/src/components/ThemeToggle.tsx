import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { applyTheme, useIsDarkTheme } from '@/hooks/useTheme';

export function ThemeToggle({ className }: { className?: string }) {
  const { t } = useTranslation();
  const isDark = useIsDarkTheme();

  const toggleDarkMode = () => {
    applyTheme(!isDark);
    localStorage.theme = isDark ? 'light' : 'dark';
  };

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className={cn('rounded-lg p-2 transition-colors hover:bg-muted/80', className)}
      aria-label={t('navigation.darkMode')}
      aria-pressed={isDark}
    >
      <div className="relative w-5 h-5">
        {/* Moon icon for dark mode */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={cn(
            'h-5 w-5 transition-opacity duration-300',
            isDark ? 'opacity-100' : 'opacity-0',
          )}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>

        {/* Sun icon for light mode */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={cn(
            'h-5 w-5 transition-opacity duration-300',
            !isDark ? 'opacity-100' : 'opacity-0',
          )}
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </div>
    </button>
  );
}
