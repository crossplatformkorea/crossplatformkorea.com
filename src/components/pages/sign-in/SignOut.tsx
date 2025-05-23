import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '@convex-dev/auth/react';
import { t } from '../../../lib/i18n';
import { cn } from '../../../lib/utils';

export default function SignOut() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signOut } = useAuthActions(); // signOut is still needed from here
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the signOut function from Convex Auth
      await signOut();

      // Add a small delay to ensure auth state is updated
      setTimeout(() => {
        // Navigate to home page after successful logout
        void navigate('/');
      }, 500);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to sign out. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          {t('signIn.alreadySignedInTitle')}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{t('signIn.alreadySignedInMessage')}</p>
      </div>

      <div className="mt-8 space-y-6">
        {error && (
          <div
            className={cn(
              // Container with scroll
              'flex text-red-500 text-sm',
              'max-h-[6em] overflow-y-auto',
              'bg-red-50/10 rounded p-2',
              'border border-red-200/20',
            )}
          >
            <pre className="whitespace-pre-wrap break-words w-full font-sans">{error}</pre>
          </div>
        )}

        <button
          onClick={() => void handleSignOut()}
          disabled={isLoading}
          className={cn(
            'w-full py-3 rounded-lg font-medium transition-all',
            'bg-gradient-to-r from-red-600 to-red-500',
            'text-white shadow-lg shadow-red-500/20',
            // State styles
            'hover:from-red-700 hover:to-red-600',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isLoading ? t('signIn.signingOut') : t('signIn.signOut')}
        </button>

        <button
          onClick={() => void navigate('/')}
          className={cn(
            // Base styles
            'w-full py-3 rounded-lg font-medium transition-all',
            'bg-muted/50 text-muted-foreground',
            // Hover styles
            'hover:bg-muted',
          )}
        >
          {t('signIn.returnToHome')}
        </button>
      </div>
    </>
  );
}
