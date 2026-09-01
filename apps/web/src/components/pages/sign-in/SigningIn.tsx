import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '@convex-dev/auth/react';
import { useConvexAuth, useMutation } from 'convex/react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { ArrowLeft, ArrowRight, Mail, ShieldCheck } from 'lucide-react';
import { api } from '@convex/_generated/api';
import { t, getLocale } from '../../../lib/i18n';
import { devConsole } from '../../../lib/utils';
import { Button } from '../../uis/Button';

// Upper bound on waiting for the Convex client to pick up the new identity.
const PROFILE_SYNC_TIMEOUT_MS = 5000;

interface SigningInProps {
  returnTo: string;
}

export default function SigningIn({ returnTo }: SigningInProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingProfileEmail, setPendingProfileEmail] = useState<string | null>(null);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const navigate = useNavigate();
  const createOrUpdateUser = useMutation(api.users.mutation.createOrUpdateUser);
  const providerId = `resend-otp-${getLocale()}`;

  const handleSendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn(providerId, { email });
      setIsCodeSent(true);
    } catch (sendError) {
      devConsole.error('Error sending verification code:', sendError);
      setError(
        sendError instanceof Error
          ? sendError.message
          : 'Failed to send verification code. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setIsGitHubLoading(true);
    setError(null);

    try {
      await signIn('github', { redirectTo: returnTo });
    } catch (signInError) {
      devConsole.error('Error signing in with GitHub:', signInError);
      setError(
        signInError instanceof Error
          ? signInError.message
          : 'Failed to sign in with GitHub. Please try again.',
      );
      setIsGitHubLoading(false);
    }
  };

  const handleVerifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn(providerId, { email, code });
      // `signIn` resolves once the tokens are stored, but the Convex client has
      // not re-authenticated its socket yet. Calling the profile mutation here
      // sends it unauthenticated, so defer it until `isAuthenticated` flips.
      setPendingProfileEmail(email);
    } catch (verifyError) {
      devConsole.error('Error verifying code:', verifyError);
      setError(
        verifyError instanceof Error
          ? verifyError.message
          : 'Failed to verify code. Please check the code and try again.',
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!pendingProfileEmail) return;

    let cancelled = false;

    const goToDestination = () => {
      if (cancelled) return;
      setPendingProfileEmail(null);
      setIsLoading(false);
      void navigate(returnTo, { replace: true });
    };

    // The sign-in already succeeded, so never strand the user on the form if the
    // client identity is slow to settle. Use a full reload rather than an SPA
    // navigate: while the socket re-auth is pending, useConvexAuth reports
    // isLoading:false + isAuthenticated:false, so route guards would bounce an
    // apparently signed-out user straight back to this form. A fresh load
    // re-reads the stored token with isLoading:true and the guards wait.
    const timeout = setTimeout(() => {
      if (cancelled) return;
      window.location.replace(returnTo);
    }, PROFILE_SYNC_TIMEOUT_MS);

    const cleanup = () => {
      cancelled = true;
      clearTimeout(timeout);
    };

    if (!isAuthenticated) return cleanup;

    const finishSignIn = async () => {
      try {
        await createOrUpdateUser({ email: pendingProfileEmail });
      } catch (profileError) {
        // The profile page recreates a missing profile on its own, so a failure
        // here must not surface as a sign-in error.
        devConsole.error('Failed to create user profile after sign-in:', profileError);
      }

      clearTimeout(timeout);
      goToDestination();
    };

    void finishSignIn();

    return cleanup;
  }, [pendingProfileEmail, isAuthenticated, createOrUpdateUser, navigate, returnTo]);

  const errorMessage = error ? (
    <div
      role="alert"
      className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
    >
      {error}
    </div>
  ) : null;

  if (isCodeSent) {
    return (
      <>
        <div className="mb-8">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
            <ShieldCheck size={21} />
          </div>
          <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            {t('signIn.verifyEmailTitle')}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            <span className="font-medium text-foreground">{email}</span>
            <br />
            {t('signIn.verifyEmailMessage')}
          </p>
        </div>

        <form className="space-y-5" onSubmit={(event) => void handleVerifyCode(event)}>
          <div>
            <label htmlFor="code" className="field-label">
              {t('signIn.verificationCodeLabel')}
            </label>
            <input
              id="code"
              name="code"
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 8))}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{8}"
              maxLength={8}
              required
              autoFocus
              className="field-control h-16 text-center font-mono text-2xl tracking-[0.32em] sm:text-3xl"
              placeholder="00000000"
            />
          </div>

          {errorMessage}

          <Button
            type="submit"
            disabled={isLoading || code.length !== 8}
            variant="auth"
            size="lg"
            className="w-full"
          >
            {isLoading ? t('signIn.verifying') : t('signIn.verifyCode')}
            {!isLoading && <ArrowRight size={17} />}
          </Button>
          <Button
            type="button"
            onClick={() => setIsCodeSent(false)}
            variant="ghost"
            size="lg"
            className="w-full"
          >
            <ArrowLeft size={16} />
            {t('signIn.back')}
          </Button>
        </form>
      </>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
          <Mail size={20} />
        </div>
        <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
          {t('signIn.title')}
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{t('signIn.signInMessage')}</p>
      </div>

      <form className="space-y-5" onSubmit={(event) => void handleSendCode(event)}>
        <div>
          <label htmlFor="email" className="field-label">
            {t('signIn.emailLabel')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            className="field-control h-12"
            placeholder={t('signIn.emailPlaceholder')}
          />
        </div>

        {errorMessage}

        <Button type="submit" disabled={isLoading} variant="auth" size="lg" className="w-full">
          {isLoading ? t('signIn.sendingCode') : t('signIn.signInWithEmail')}
          {!isLoading && <ArrowRight size={17} />}
        </Button>
      </form>

      <div className="my-7 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        <span>or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        onClick={() => void handleGitHubSignIn()}
        disabled={isGitHubLoading}
        variant="secondary"
        size="lg"
        className="w-full"
      >
        <SiGithub size={18} />
        {isGitHubLoading ? t('signIn.signingInWithGithub') : t('signIn.signInWithGithub')}
      </Button>
    </>
  );
}
