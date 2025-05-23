import { cn } from '../../../lib/utils';
import SignOut from './SignOut';
import SigningIn from './SigningIn';
import { t } from '../../../lib/i18n';
import { useAuthStore } from '@/stores/authStore';

export default function SignIn() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Loading animation component
  const LoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-12 h-12 sm:w-16 sm:h-16"> {/* Smaller on mobile */}
        {/* Film reel animation */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse"></div>
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-primary/50 animate-spin-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-primary animate-ping"></div> {/* Smaller on mobile */}
        </div>
      </div>
      <p className="text-sm sm:text-base text-muted-foreground animate-pulse">{t('common.loading')}</p> {/* Smaller text on mobile */}
    </div>
  );

  return (
    <div
      className={cn(
        'h-screen flex flex-col relative overflow-hidden',
        'bg-gradient-to-b from-background to-background/95',
      )}
    >
      {/* Decorative elements - Image placeholders - Hide some on small screens */}
      <div className="absolute -top-20 -left-20 w-48 h-48 sm:w-64 sm:h-64 opacity-20 rounded-full bg-primary/30 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/4 -right-32 w-64 h-64 sm:w-96 sm:h-96 opacity-20 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>

      {/* Movie reel decoration - top right - Hide on small screens */}
      <div className="hidden sm:block absolute top-20 right-10 w-32 h-32 opacity-10 pointer-events-none">
        <div className="w-full h-full rounded-full border-4 border-primary/40 flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-full border-dashed border-2 border-primary/60 animate-spin-slow"></div>
        </div>
      </div>

      {/* Movie ticket decoration - bottom left - Hide on small screens */}
      <div className="hidden sm:block absolute bottom-10 left-10 w-40 h-20 opacity-20 pointer-events-none">
        {/* Placeholder for movie ticket image */}
        <div className="w-full h-full rounded-lg border-2 border-primary/50 rotate-12 bg-primary/5"></div>
      </div>

      <div
        className={cn(
          // Base layout
          'flex-1 flex justify-center items-center relative z-10',
          // Spacing
          'p-3 pb-8 md:p-12 md:pb-24', // Reduced padding on mobile
        )}
      >
        <div
          className={cn(
            // Base layout
            'w-full max-w-[95%] sm:max-w-md space-y-6 sm:space-y-8 relative', // Reduced width and spacing on mobile
            // Adjust for mobile
            'md:max-w-md',
          )}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-primary/30 blur-sm"></div>

          <div
            className={cn(
              // Base styles
              'p-3 sm:p-4 rounded-xl relative overflow-hidden', // Reduced padding on mobile
              // Visual effects
              'bg-background/80 backdrop-blur-md',
              'border border-border/50',
              'shadow-2xl',
              // Size constraints
              'max-h-[85vh] w-full sm:max-w-md', // Adjusted for better mobile view
            )}
          >
            {/* Projector light effect */}
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-32 sm:w-40 h-32 sm:h-40 bg-primary/10 blur-2xl"></div>

            {/* Logo image - replacing placeholder */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mt-2 sm:mt-4 flex items-center justify-center"> {/* Smaller on mobile */}
              <img src="/assets/logo.png" alt={t('common.appName')} className="w-12 sm:w-16 h-auto" /> {/* Smaller on mobile */}
            </div>

            <div className="overflow-y-auto max-h-[60vh] sm:max-h-[50vh] py-1 px-1"> {/* Taller on mobile */}
              {isLoading ? <LoadingAnimation /> : isAuthenticated ? <SignOut /> : <SigningIn />}
            </div>
          </div>

          {/* Image placeholder for movie projector - Hide on small screens */}
          <div className="hidden sm:block absolute -right-12 -bottom-8 w-28 h-28 opacity-20 pointer-events-none">
            <div className="w-full h-full border border-primary/20 rounded-lg rotate-12"></div>
          </div>
        </div>
      </div>

      <div className="h-3 sm:h-4 w-full bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5"></div> {/* Smaller on mobile */}
    </div>
  );
}
