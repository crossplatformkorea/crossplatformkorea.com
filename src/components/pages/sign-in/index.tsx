import { cn } from "../../../lib/utils";
import SignOut from "./SignOut";
import SigningIn from "./SigningIn";
import { t } from "../../../lib/i18n";
import { useAuthStore } from "@/stores/authStore";

export default function SignIn() {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Loading animation component
  const LoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        {/* Film reel animation */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse"></div>
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-primary/50 animate-spin-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-primary animate-ping"></div>
        </div>
      </div>
      <p className="text-muted-foreground animate-pulse">
        {t("common.loading")}
      </p>
    </div>
  );

  return (
    <div
      className={cn(
        // Base styles
        "h-screen flex flex-col relative overflow-hidden",
        // Background styles
        "bg-gradient-to-b from-background to-background/95"
      )}
    >
      {/* Decorative elements - Image placeholders */}
      <div className="absolute -top-20 -left-20 w-64 h-64 opacity-20 rounded-full bg-primary/30 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/4 -right-32 w-96 h-96 opacity-20 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>

      {/* Movie reel decoration - top right */}
      <div className="absolute top-20 right-10 w-32 h-32 opacity-10 pointer-events-none">
        {/* Placeholder for movie reel image */}
        <div className="w-full h-full rounded-full border-4 border-primary/40 flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-full border-dashed border-2 border-primary/60 animate-spin-slow"></div>
        </div>
      </div>

      {/* Movie ticket decoration - bottom left */}
      <div className="absolute bottom-10 left-10 w-40 h-20 opacity-20 pointer-events-none">
        {/* Placeholder for movie ticket image */}
        <div className="w-full h-full rounded-lg border-2 border-primary/50 rotate-12 bg-primary/5"></div>      </div>

      <div
        className={cn(
          // Base layout
          "flex-1 flex justify-center items-center relative z-10",
          // Spacing
          "p-4 pb-12 md:p-12 md:pb-24"
        )}
      >
        <div
          className={cn(
            // Base layout
            "w-full max-w-md space-y-8 relative",
            // Adjust for mobile
            "md:max-w-md"
          )}
        >
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-primary/30 blur-sm"></div>

          <div
            className={cn(
              // Base styles
              "p-4 rounded-xl relative overflow-hidden",
              // Visual effects
              "bg-background/80 backdrop-blur-md",
              "border border-border/50",
              "shadow-2xl",
              // Size constraints
              "max-h-[80vh] md:max-w-md"
            )}
          >
            {/* Projector light effect */}
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-primary/10 blur-2xl"></div>

            {/* Logo image - replacing placeholder */}
            <div className="w-20 h-20 mx-auto mt-4 flex items-center justify-center">
              <img
                src="/assets/logo.png"
                alt={t("common.appName")}
                className="w-16 h-auto"
              />
            </div>

            <div className="overflow-y-auto max-h-[50vh] py-1 px-1">
              {isLoading ? (
                <LoadingAnimation />
              ) : isAuthenticated ? (
                <SignOut />
              ) : (
                <SigningIn />
              )}
            </div>
          </div>

          {/* Image placeholder for movie projector */}
          <div className="absolute -right-12 -bottom-8 w-28 h-28 opacity-20 pointer-events-none">
            <div className="w-full h-full border border-primary/20 rounded-lg rotate-12"></div>
          </div>
        </div>
      </div>

      <div className="h-4 w-full bg-gradient-to-r from-primary/5 via-primary/20 to-primary/5"></div>
    </div>
  );
}
