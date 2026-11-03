import { Link } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  MessageSquare,
  Layers,
  PenLine,
  User,
} from 'lucide-react';
import { api } from '@convex/_generated/api';
import { useAuthStore } from '@/stores/authStore';
import { useMetaTags } from '@/hooks/useMetaTags';
import { createSignInHref } from '@/lib/authRedirect';
import SummaryPostItem from './SummaryPostItem';
import UserStats from './UserStats';
import PlatformVisual from './PlatformVisual';
import HomeHeadline from './HomeHeadline';
import { motion, useReducedMotion } from 'framer-motion';
import { interactionSpring } from '@/lib/motion';

const MotionLink = motion.create(Link);

const technologies = [
  'React Native',
  'Flutter',
  'Kotlin Multiplatform',
  'Expo',
  'Tauri',
  'Electron',
];

export default function SummaryPage() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
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
  const destinations = [
    { key: 'discuss', to: '/posts', icon: MessageSquare },
    { key: 'discover', to: '/showcase', icon: Layers },
    { key: 'learn', to: 'https://doc.crossplatformkorea.com', icon: BookOpen },
  ];

  return (
    <div className="relative">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-4">
          <div className="relative z-10">
            <p className="section-kicker">{t('summary.eyebrow')}</p>
            <HomeHeadline
              firstLine={t('summary.headlineFirst')}
              secondLine={t('summary.headlineSecond')}
            />
            <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
              {t('summary.heroDescription')}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MotionLink
                to="/posts"
                className="home-primary-link group"
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                transition={interactionSpring}
              >
                {t('summary.exploreCommunity')}
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </MotionLink>
              <MotionLink
                to="/showcase"
                className="home-secondary-link group"
                whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                transition={interactionSpring}
              >
                {t('summary.exploreApps')}
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </MotionLink>
            </div>
          </div>
          <PlatformVisual />
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border/70 pt-5 sm:mt-12 sm:gap-x-8">
          {technologies.map((technology) => (
            <span
              key={technology}
              className="text-[11px] font-medium tracking-tight text-muted-foreground sm:text-xs"
            >
              {technology}
            </span>
          ))}
        </div>
      </section>

      <section
        className="grid border-y border-border/80 md:grid-cols-3"
        aria-label={t('summary.exploreLabel')}
      >
        {destinations.map(({ key, to, icon: Icon }) => {
          const content = (
            <>
              <Icon size={19} strokeWidth={1.5} className="text-muted-foreground" />
              <div className="mt-5 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold tracking-tight">{t(`summary.${key}Title`)}</h2>
                <ArrowUpRight
                  size={18}
                  className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none"
                />
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t(`summary.${key}Description`)}
              </p>
            </>
          );
          return to.startsWith('https://') ? (
            <a
              key={key}
              href={to}
              target="_blank"
              rel="noopener noreferrer"
              className="home-destination group"
            >
              {content}
            </a>
          ) : (
            <Link key={key} to={to} className="home-destination group">
              {content}
            </Link>
          );
        })}
      </section>

      <section className="py-12 sm:py-16" aria-labelledby="latest-title">
        <div className="mb-7 flex items-end justify-between gap-4">
          <h2
            id="latest-title"
            className="text-balance text-2xl font-bold tracking-[-0.04em] sm:text-3xl"
          >
            {t('summary.latestTitle')}
          </h2>
          <Link
            to="/posts"
            className="inline-flex shrink-0 items-center gap-2 py-2 text-xs font-semibold hover:underline sm:text-sm"
          >
            {t('common.viewAll')} <ArrowRight size={15} />
          </Link>
        </div>

        {recentPosts === undefined ? (
          <div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            role="status"
            aria-label={t('common.loading')}
          >
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl border border-border/70 bg-card/60 motion-reduce:animate-none"
              />
            ))}
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="surface-card px-5 py-14 text-center">
            <PenLine className="mx-auto mb-4 text-muted-foreground" size={26} />
            <p className="text-muted-foreground">{t('posts.noPosts')}</p>
            <Link to="/posts" className="home-secondary-link mt-5">
              {t('summary.exploreCommunity')} <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post, index) => (
              <SummaryPostItem key={post._id} post={post} featured={index === 0} order={index} />
            ))}
          </div>
        )}
      </section>

      <section className="mb-12 sm:mb-16" aria-label={t('summary.memberLabel')}>
        {isAuthenticated && userIdentity ? (
          <div className="surface-card p-5 sm:p-7">
            <div className="flex items-center gap-4">
              <Link
                to={userProfileUrl}
                aria-label={t('common.profile')}
                className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted"
              >
                {userIdentity.avatarUrl ? (
                  <img src={userIdentity.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <User className="absolute inset-0 m-auto h-6 w-6 text-muted-foreground" />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{t('summary.welcomeBack')}</p>
                <Link
                  to={userProfileUrl}
                  className="mt-1 block truncate text-lg font-semibold hover:underline"
                >
                  {userIdentity.profile?.displayName || userIdentity.email?.split('@')[0]}
                </Link>
              </div>
              <Link to="/profile" className="home-secondary-link text-xs sm:text-sm">
                {t('profile.viewEdit')} <ArrowRight size={15} />
              </Link>
            </div>
            {userIdentity._id && <UserStats userId={userIdentity._id} className="mt-6" />}
          </div>
        ) : !isAuthenticated ? (
          <div className="home-member-panel">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background">
              <PenLine size={18} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold tracking-tight">{t('summary.memberTitle')}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {t('summary.memberDescription')}
              </p>
            </div>
            <Link to={createSignInHref('/posts')} className="home-secondary-link shrink-0">
              {t('common.loginToWrite')}
            </Link>
          </div>
        ) : null}
      </section>

      <footer className="flex flex-col gap-4 border-t border-border/80 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img src="/assets/logo.png" alt="" width={24} height={24} className="h-6 w-6" />
          <span className="text-xs font-medium">Cross-Platform Korea</span>
          <span className="hidden text-xs text-muted-foreground lg:inline">
            {t('summary.footerNote')}
          </span>
        </div>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <a
            href="https://github.com/crossplatformkorea"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            GitHub ↗
          </a>
          <a
            href="https://discord.gg/XN53mmA9"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            Discord ↗
          </a>
          <a
            href="https://doc.crossplatformkorea.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            {t('common.navDoc')} ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
