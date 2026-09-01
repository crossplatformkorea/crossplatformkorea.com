import { Navigate, useSearchParams } from 'react-router-dom';
import { t } from '../../../lib/i18n';
import { sanitizeReturnTo } from '../../../lib/authRedirect';
import { useAuthStore } from '@/stores/authStore';
import SigningIn from './SigningIn';

function LoadingState() {
  return (
    <div className="flex h-full items-center justify-center bg-background">
      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
        {t('common.loading')}
      </div>
    </div>
  );
}

export default function SignIn() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [searchParams] = useSearchParams();
  const returnTo = sanitizeReturnTo(searchParams.get('returnTo'));

  if (isLoading) return <LoadingState />;
  if (isAuthenticated) return <Navigate to={returnTo} replace />;

  return (
    <main className="auth-canvas h-full overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex min-h-full max-w-6xl flex-col">
        <a
          href="/"
          className="group inline-flex w-fit items-center gap-3"
          aria-label={t('common.appName')}
        >
          <img src="/assets/logo.png" alt="" className="h-8 w-8" />
          <span className="text-sm font-semibold tracking-[-0.02em]">{t('common.appName')}</span>
        </a>

        <div className="my-auto grid items-stretch gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <section className="hidden flex-col justify-between py-3 lg:flex lg:py-8">
            <div>
              <div className="section-kicker">
                <span>CPK / ACCESS</span>
                <span className="h-px w-10 bg-current opacity-40" />
                <span>2026</span>
              </div>
              <h1 className="mt-7 max-w-2xl text-[clamp(3.3rem,8vw,7.5rem)] font-semibold leading-[0.84] tracking-[-0.075em]">
                Build.
                <br />
                Share.
                <br />
                <span className="text-primary">Connect.</span>
              </h1>
              <p className="mt-8 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
                {t('signIn.signInMessage')}
              </p>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-3 border-y border-border/80 py-4 text-xs sm:text-sm">
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  01
                </span>
                <span className="mt-1 block font-medium">Email OTP</span>
              </div>
              <div className="border-l border-border/80 pl-4">
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  02
                </span>
                <span className="mt-1 block font-medium">GitHub</span>
              </div>
              <div className="border-l border-border/80 pl-4">
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  03
                </span>
                <span className="mt-1 block font-medium">Secure</span>
              </div>
            </div>
          </section>

          <section className="relative mx-auto flex w-full max-w-lg items-center lg:max-w-none">
            <div className="pointer-events-none absolute -right-8 -top-8 hidden font-mono text-[9rem] leading-none text-primary/10 lg:block">
              /
            </div>
            <div className="auth-panel relative w-full overflow-hidden p-6 sm:p-9">
              <div className="mb-10 flex items-center justify-between border-b border-border/70 pb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>Member access</span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" /> Online
                </span>
              </div>
              <SigningIn returnTo={returnTo} />
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between border-t border-border/70 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span>Cross-platform community</span>
          <span>Seoul · Korea</span>
        </div>
      </div>
    </main>
  );
}
