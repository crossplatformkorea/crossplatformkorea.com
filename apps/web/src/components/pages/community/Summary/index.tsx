import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, PenLine, User } from 'lucide-react';
import { api } from '@convex/_generated/api';
import { useAuthStore } from '@/stores/authStore';
import { useMetaTags } from '@/hooks/useMetaTags';
import SummaryPostItem from './SummaryPostItem';
import UserStats from './UserStats';

export default function SummaryPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const recentPosts = useQuery(api.posts.query.getRecentPosts, { limit: 6 });
  const userIdentity = useQuery(api.users.query.currentUser);

  useMetaTags({
    title: '크로스플랫폼 코리아 — 한국 크로스플랫폼 개발자 커뮤니티',
    description:
      'React Native, Flutter, Kotlin Multiplatform, Tauri, Electron 등 크로스플랫폼 개발 소식 · Q&A · 쇼케이스를 공유하는 한국어 개발자 커뮤니티.',
    canonical: '/',
    ogUrl: '/',
    ogType: 'website',
  });

  const userProfileUrl = userIdentity?.profile?.displayName
    ? `/@${userIdentity.profile.displayName}`
    : '/profile';

  return (
    <div className="relative pb-16">
      <section className="relative overflow-hidden border-b border-border/80 pb-10 pt-4 [container-type:inline-size] sm:pb-14 sm:pt-8">
        <div className="section-kicker">
          <span>CPK / COMMUNITY</span>
          <span className="h-px w-10 bg-current opacity-40" />
          <span>SEOUL</span>
        </div>
        <div className="mt-7 grid items-end gap-x-8 gap-y-7 lg:grid-cols-[1fr_18rem]">
          <h1 className="whitespace-nowrap text-[clamp(2.15rem,1rem+6.5cqw,6.75rem)] font-semibold leading-none tracking-[-0.075em] sm:text-[clamp(2.15rem,0.75rem+8cqw,6.75rem)] lg:col-span-2">
            {t('summary.heroTitle')}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {t('summary.heroDescription')}
          </p>
          <div className="border-l border-border/80 pl-5">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Community signal
            </span>
            <p className="mt-3 text-sm leading-6">
              React Native · Flutter · KMP · Expo · Tauri · Electron
            </p>
            <Link
              to="/posts"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3"
            >
              {t('common.viewAll')} <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10">
        {isAuthenticated && userIdentity ? (
          <div className="surface-card p-5 sm:p-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Link
                to={userProfileUrl}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-muted"
              >
                {userIdentity.avatarUrl ? (
                  <img src={userIdentity.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <User className="absolute inset-0 m-auto h-7 w-7 text-muted-foreground" />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <div className="section-kicker">SIGNED IN / PROFILE</div>
                <Link
                  to={userProfileUrl}
                  className="mt-2 block truncate text-2xl font-semibold tracking-[-0.035em] hover:text-primary"
                >
                  {userIdentity.profile?.displayName || userIdentity.email?.split('@')[0]}
                </Link>
                {userIdentity.profile?.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {userIdentity.profile.description}
                  </p>
                )}
              </div>
              <Link
                to="/profile"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-4 text-sm font-semibold transition hover:border-primary/45 hover:bg-primary/5 hover:text-primary"
              >
                {t('profile.viewEdit')} <ArrowRight size={15} />
              </Link>
            </div>
            {userIdentity._id && <UserStats userId={userIdentity._id} className="mt-6" />}
          </div>
        ) : (
          <div className="surface-card flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
            <div>
              <div className="section-kicker">MEMBER ACCESS</div>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                {t('common.loginToAccess')}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{t('auth.loginDescription')}</p>
            </div>
            <Link
              to="/sign-in"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_12px_28px_-16px_hsl(var(--primary))] transition hover:-translate-y-0.5 hover:bg-primary/90 dark:border dark:border-border/80 dark:bg-muted dark:text-foreground dark:shadow-none dark:hover:bg-muted/80"
            >
              {t('common.signIn')} <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-border/80 pb-4">
          <div>
            <div className="section-kicker">LATEST / 06</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
              {t('posts.recentPosts')}
            </h2>
          </div>
          <Link
            to="/posts"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            {t('common.viewAll')} <ArrowRight size={15} />
          </Link>
        </div>

        {recentPosts === undefined ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl border border-border/70 bg-card/60"
              />
            ))}
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="surface-card py-16 text-center">
            <PenLine className="mx-auto mb-4 text-primary" size={26} />
            <p className="text-muted-foreground">{t('posts.noPosts')}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <SummaryPostItem key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
