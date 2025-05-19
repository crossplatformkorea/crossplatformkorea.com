import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { t, getLocale } from "../../../lib/i18n";
import { cn } from "../../../lib/utils";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function SigningIn() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  
  // Add mutation for creating/updating user profile
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  
  // Use the appropriate provider ID based on current locale
  const locale = getLocale();
  const providerId = `resend-otp-${locale}`;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn(providerId, { email });
      setIsCodeSent(true);
    } catch (error) {
      console.error("Error sending verification code:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // First, authenticate the user with OTP
      await signIn(providerId, { email, code });
      
      // After successful authentication, create or update user profile
      await createOrUpdateUser({ email });
      
      // Navigate to the main screen after successful authentication
      void navigate("/");
    } catch (error) {
      console.error("Error verifying code:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to verify code. Please check the code and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Get title and message based on verification step
  const getContent = () => {
    if (isCodeSent) {
      return {
        title: t("signIn.verifyEmailTitle"),
        message: t("signIn.verifyEmailMessage"),
      };
    } else {
      return {
        title: t("signIn.title"),
        message: t("signIn.signInMessage"),
      };
    }
  };

  const content = getContent();

  if (!isCodeSent) {
    return (
      <>
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {content.title}
          </h2>
        </div>
        
        <form
          className="mt-8 space-y-6"
          onSubmit={(event) => {
            void handleSendCode(event);
          }}
        >
          <div className="space-y-4 rounded-md">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
              >
                {t("signIn.emailLabel")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className={cn(
                  // Base styles
                  "w-full px-3 py-3 rounded-md transition-all",
                  "bg-background/50 backdrop-blur-sm",
                  "border border-border/50",
                  "outline-none",
                  // Focus styles
                  "focus-visible:ring-2 focus-visible:ring-primary/50",
                  "focus-visible:ring-offset-0",
                  "focus-visible:border-primary/50"
                )}
                placeholder={t("signIn.emailPlaceholder")}
              />
            </div>

            {error && (
              <div className={cn(
                // Container with scroll
                "flex text-red-500 text-sm mt-1",
                "max-h-[6em] overflow-y-auto",
                "bg-red-50/10 rounded p-2",
                "border border-red-200/20"
              )}>
                <pre className="whitespace-pre-wrap break-words w-full font-sans">
                  {error}
                </pre>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                // Base styles
                "w-full py-3 rounded-lg font-medium transition-all",
                "bg-gradient-to-r from-primary to-primary/90",
                "text-primary-foreground shadow-lg shadow-primary/20",
                // State styles
                "hover:from-primary/90 hover:to-primary/80",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLoading
                ? t("signIn.sendingCode")
                : t("signIn.signInWithEmail")}
            </button>
          </div>
        </form>
        
        {/* Helper text below the form */}
        <div className="mt-4 text-center bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-lg px-5 py-4">
          <p className="text-sm text-muted-foreground">
            {t("signIn.signInMessage")}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="text-center">
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          {content.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {content.message}
        </p>
      </div>
    
      <form
        className="mt-8 space-y-6"
        onSubmit={(event) => {
          void handleVerifyCode(event);
        }}
      >
        <div className="space-y-4 rounded-md">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium mb-1"
            >
              {t("signIn.verificationCodeLabel")}
            </label>
            <input
              id="code"
              name="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              pattern="[0-9]{8}"
              required
              className={cn(
                // Base styles
                "w-full px-4 py-3 rounded-md transition-all",
                "bg-background/50 backdrop-blur-sm",
                "border border-border/50",
                "outline-none",
                // Focus styles
                "focus-visible:ring-2 focus-visible:ring-primary/50",
                "focus-visible:ring-offset-0",
                "focus-visible:border-primary/50"
              )}
              placeholder={t("signIn.verificationCodePlaceholder")}
            />
          </div>

          {error && (
            <div className={cn(
              // Container with scroll
              "flex text-red-500 text-sm mt-1",
              "max-h-[6em] overflow-y-auto", // Approximately 6 lines of text
              "bg-red-50/10 rounded p-2",
              "border border-red-200/20"
            )}>
              <pre className="whitespace-pre-wrap break-words w-full font-sans">
                {error}
              </pre>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-3">
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              // Base styles
              "w-full py-3 rounded-lg font-medium transition-all",
              "bg-gradient-to-r from-primary to-primary/90",
              "text-primary-foreground shadow-lg shadow-primary/20",
              // State styles
              "hover:from-primary/90 hover:to-primary/80",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading
              ? t("signIn.verifying")
              : t("signIn.verifyCode")}
          </button>

          <button
            type="button"
            onClick={() => setIsCodeSent(false)}
            className={cn(
              // Base styles
              "w-full py-3 rounded-lg font-medium transition-all",
              "bg-muted/50 text-muted-foreground",
              // Hover styles
              "hover:bg-muted"
            )}
          >
            {t("signIn.back")}
          </button>
        </div>
      </form>
    </>
  );
}