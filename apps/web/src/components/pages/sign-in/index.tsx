import { Navigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { sanitizeReturnTo } from '../../../lib/authRedirect';
import { useAuthStore } from '@/stores/authStore';
import SigningIn from './SigningIn';

function LoadingState() {
  const { t } = useTranslation();
  return (
    <div className="flex h-full items-center justify-center bg-background">
      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary motion-reduce:animate-none" />
        {t('common.loading')}
      </div>
    </div>
  );
}

export default function SignIn() {
  // Subscribing re-renders the page (and the form inside it) when the language changes.
  const { t } = useTranslation();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [searchParams] = useSearchParams();
  const returnTo = sanitizeReturnTo(searchParams.get('returnTo'));

  if (isLoading) return <LoadingState />;
  if (isAuthenticated) return <Navigate to={returnTo} replace />;

  // The app layout already renders <main> and the logo, so this page only adds content.
  return (
    <div className="auth-canvas h-full overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex min-h-full max-w-6xl items-center">
        <div className="grid w-full items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <h1 className="sr-only">{t('signIn.title')}</h1>
          <section className="hidden lg:block">
            <p
              aria-hidden="true"
              className="max-w-2xl text-[clamp(3.3rem,8vw,7.5rem)] font-bold leading-[0.92] tracking-[-0.075em]"
            >
              {t('signIn.slogan')
                .split('\n')
                .map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
            </p>
            <p className="mt-8 max-w-md text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              {t('signIn.intro')}
            </p>
          </section>

          <section className="mx-auto w-full max-w-lg lg:max-w-none">
            <div className="auth-panel w-full p-6 sm:p-9">
              <SigningIn returnTo={returnTo} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
