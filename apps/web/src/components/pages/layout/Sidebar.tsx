import { Link, useLocation } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { ArrowUpRight, ChevronRight, LogIn, User, X } from 'lucide-react';
import { t } from 'i18next';
import { api } from '@convex/_generated/api';
import { sidebarItems } from '@/constants/sidebar';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { Button } from '../../uis/Button';
import { createSignInHref } from '@/lib/authRedirect';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const revealClass = (isOpen: boolean) =>
  cn(
    'transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none',
    isOpen ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-2 opacity-0',
  );

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const userData = useQuery(api.users.query.currentUser);

  const isActive = (path: string) => location.pathname.startsWith(path);
  const mainItems = sidebarItems.filter((item) => !item.route.startsWith('http'));
  const resourceItems = sidebarItems.filter((item) => item.route.startsWith('http'));

  return (
    <aside
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden border-r border-border/70 pt-14 backdrop-blur-xl transition-[background-color,box-shadow] duration-500 motion-reduce:transition-none md:pt-0',
        isOpen
          ? 'bg-card/95 shadow-[14px_0_50px_-38px_rgba(0,0,0,0.55)]'
          : 'bg-card/85 shadow-[10px_0_40px_-36px_rgba(0,0,0,0.45)]',
      )}
    >
      {onClose && (
        <div className="absolute left-0 right-0 top-0 z-10 flex h-14 items-center justify-between border-b border-border/70 bg-card/95 px-3 backdrop-blur-sm md:hidden">
          <div className="flex min-w-0 items-center gap-2.5">
            <img src="/assets/logo.png" alt="" className="h-8 w-8 shrink-0" />
            <span className="truncate text-sm font-semibold tracking-[-0.02em]">
              {t('common.appName')}
            </span>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl"
            aria-label={t('common.close')}
          >
            <X size={18} />
          </Button>
        </div>
      )}

      <nav className="relative flex-1 px-2 py-3" aria-label="Primary navigation">
        <ul className="space-y-1.5">
          {mainItems.map((item, index) => {
            const active = isActive(item.route);
            return (
              <li key={item.key}>
                <Link
                  to={item.route}
                  title={!isOpen ? t(item.labelKey) : undefined}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative flex h-11 items-center rounded-lg px-3 transition-[background-color,color,box-shadow] duration-300',
                    active
                      ? 'bg-muted/75 text-foreground ring-1 ring-inset ring-border/70 before:absolute before:left-0 before:h-5 before:w-0.5 before:rounded-r-full before:bg-foreground/75'
                      : 'text-muted-foreground hover:bg-muted/75 hover:text-foreground',
                  )}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    <item.icon size={19} />
                  </span>
                  <span
                    className={cn(
                      'ml-2 flex min-w-[10rem] flex-1 items-center',
                      revealClass(isOpen),
                    )}
                    style={{ transitionDelay: isOpen ? `${80 + index * 45}ms` : '0ms' }}
                  >
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {t(item.labelKey)}
                    </span>
                    {active && <ChevronRight size={14} className="shrink-0 opacity-60" />}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative border-t border-border/60 px-2 py-3">
        {resourceItems.map((item, index) => (
          <a
            key={item.key}
            href={item.route}
            target="_blank"
            rel="noopener noreferrer"
            title={!isOpen ? t(item.labelKey) : undefined}
            className="group flex h-10 items-center rounded-xl px-3 text-muted-foreground transition duration-200 hover:bg-muted/75 hover:text-foreground"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <item.icon size={18} />
            </span>
            <span
              className={cn('ml-2 flex min-w-[10rem] flex-1 items-center', revealClass(isOpen))}
              style={{ transitionDelay: isOpen ? `${210 + index * 45}ms` : '0ms' }}
            >
              <span className="flex-1 truncate text-sm font-medium">{t(item.labelKey)}</span>
              <ArrowUpRight size={13} className="shrink-0 opacity-50" />
            </span>
          </a>
        ))}
      </div>

      <div className="relative border-t border-border/70 p-2">
        {!isAuthenticated ? (
          <Link
            to={createSignInHref(`${location.pathname}${location.search}${location.hash}`)}
            title={!isOpen ? t('common.signIn') : undefined}
            className="flex h-11 items-center rounded-lg border border-border/80 bg-background/45 px-3 text-foreground transition hover:border-foreground/25 hover:bg-muted/70"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center">
              <LogIn size={18} />
            </span>
            <span
              className={cn(
                'ml-2 min-w-[10rem] truncate text-sm font-semibold',
                revealClass(isOpen),
              )}
              style={{ transitionDelay: isOpen ? '255ms' : '0ms' }}
            >
              {t('common.signIn')}
            </span>
          </Link>
        ) : (
          <Link
            to="/profile"
            title={!isOpen ? t('common.profile') : undefined}
            className="flex h-12 w-full items-center rounded-xl border border-border/70 bg-background/70 px-3 transition hover:border-foreground/30 hover:bg-muted/60"
          >
            {userData?.avatarUrl ? (
              <img
                src={userData.avatarUrl}
                alt={userData.displayName || t('common.profile')}
                className="h-8 w-8 shrink-0 rounded-lg border border-border/70 object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <User size={17} />
              </span>
            )}

            <div
              className={cn(
                'ml-2.5 flex min-w-[10rem] flex-1 items-center justify-between',
                revealClass(isOpen),
              )}
              style={{ transitionDelay: isOpen ? '255ms' : '0ms' }}
            >
              <div className="min-w-0">
                <span className="block truncate text-sm font-semibold">
                  {userData?.displayName || t('common.profile')}
                </span>
                <span className="block truncate font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  Member
                </span>
              </div>
              <ChevronRight size={15} className="ml-2 shrink-0 text-muted-foreground" />
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
}
