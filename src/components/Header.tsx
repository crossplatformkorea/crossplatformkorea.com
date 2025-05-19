import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { t, getLocale, setLocale } from "../lib/i18n";
import { cn } from "../lib/utils";

// Skeleton loader component for nav items
const NavItemSkeleton = () => (
  <div className="h-8 w-24 bg-muted/60 animate-pulse rounded-md"></div>
);

// Skeleton loader component for user profile
const UserProfileSkeleton = () => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-muted/60 animate-pulse"></div>
    <div className="h-4 w-24 bg-muted/60 animate-pulse rounded-md"></div>
  </div>
);

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Stub authentication state (no auth provider)
  const isAuthenticated = false;
  const isLoading = false;
  const currentUser = useQuery(api.users.currentUser);

  const handleNavigation = (path: string) => {
    void navigate(path);
    setIsMenuOpen(false);
  };

  const [currentLocale, setCurrentLocale] = useState<"en"|"ko"|"ja">(getLocale());
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  return (
    <>
      {/* Decorative elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 opacity-10 rounded-full bg-primary/30 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/4 -right-32 w-96 h-96 opacity-10 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>

      {/* Movie reel decoration */}
      <div className="absolute top-20 right-10 w-32 h-32 opacity-5 pointer-events-none hidden md:block">
        <div className="w-full h-full rounded-full border-4 border-primary/40 flex items-center justify-center">
          <div className="w-3/4 h-3/4 rounded-full border-dashed border-2 border-primary/60 animate-spin-slow"></div>
        </div>
      </div>

      {/* Film strip decoration */}
      <div className="absolute left-0 h-full w-6 opacity-5 pointer-events-none hidden lg:flex flex-col justify-around">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-6 h-4 bg-primary/40 rounded-sm"></div>
        ))}
      </div>

      <header
        className={cn(
          // Base layout
          "h-[90px] flex-shrink-0 flex items-center justify-between px-6 relative z-10",
          // Visual styling
          "border-b border-border/30",
          "bg-gradient-to-r from-background via-background to-background backdrop-blur-sm"
        )}
      >
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => {
            void navigate("/");
          }}
        >
          <img
            src="/assets/logo.png"
            alt={t("common.appName")}
            className="h-10 w-auto"
          />
          <div className="relative pt-1">
            <div className="absolute -left-3 -top-1 w-6 h-6 rounded-full bg-primary/20 blur-xl"></div>
            <div className="absolute -right-2 -bottom-3 w-8 h-8 rounded-full bg-primary/30 blur-xl"></div>

            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                {t("common.appName")}
              </span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-4 mr-2">
            {isLoading ? (
              <>
                <NavItemSkeleton />
                <NavItemSkeleton />
              </>
            ) : (
              <>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/");
                  }}
                  className={`font-medium text-sm px-3 py-2 rounded-md ${
                    location.pathname === "/"
                      ? "bg-primary/10 text-primary dark:bg-primary/10 dark:text-white"
                      : "hover:bg-muted dark:hover:bg-muted"
                  } transition-colors`}
                >
                  {t("common.navPost")}
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation("/feature-request");
                  }}
                  className={`font-medium text-sm px-3 py-2 rounded-md ${
                    location.pathname === "/feature-request"
                      ? "bg-primary/10 text-primary dark:bg-primary/10 dark:text-white"
                      : "hover:bg-muted dark:hover:bg-muted"
                  } transition-colors`}
                >
                  {t("common.navFeatureRequest")}
                </a>
              </>
            )}
          </nav>
          <div className="hidden sm:flex items-center gap-3">
            {isLoading ? (
              <UserProfileSkeleton />
            ) : isAuthenticated && currentUser ? (
              <div
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => void navigate("/sign-in")}
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-primary">
                      {(
                        currentUser.displayName ||
                        currentUser.profile?.displayName ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium">
                  {currentUser.displayName ||
                    currentUser.profile?.displayName ||
                    "User"}
                </div>
              </div>
            ) : (
              <button
                onClick={() => void navigate("/sign-in")}
                className="font-medium text-sm px-4 py-2 rounded-md bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 transition-all shadow-md shadow-primary/20"
              >
                {t("common.signIn")}
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center text-sm font-medium px-2 py-1 rounded-md hover:bg-muted dark:hover:bg-muted transition-colors"
              >
                {currentLocale === 'en' ? 'English' : currentLocale === 'ko' ? '한국어' : '日本語'}
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-background dark:bg-secondary backdrop-blur-md border border-border/50 rounded-md shadow-lg z-10">
                  {['en','ko','ja'].map((code) => (
                    <div
                      key={code}
                      onClick={() => {
                        setLocale(code as 'en'|'ko'|'ja');
                        setCurrentLocale(code as 'en'|'ko'|'ja');
                        setLangMenuOpen(false);
                        // reload to apply translations globally
                        window.location.reload();
                      }}
                      className="px-4 py-2 text-sm hover:bg-muted dark:hover:bg-muted cursor-pointer"
                    >
                      {code === 'en' ? 'English' : code === 'ko' ? '한국어' : '日本語'}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <a
                href="https://github.com/crossplatformkorea"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md hover:bg-muted dark:hover:bg-muted transition-colors"
              >
                <svg
                  className="w-6 h-6 text-foreground dark:text-foreground"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 0C5.371 0 0 5.371 0 12c0 5.303 3.438 9.8 8.205 11.387.6.111.793-.261.793-.579v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.73.083-.73 1.205.084 1.84 1.258 1.84 1.258 1.07 1.834 2.809 1.305 3.495.998.108-.775.418-1.305.76-1.605-2.665-.305-5.467-1.333-5.467-5.933 0-1.311.469-2.381 1.235-3.221-.123-.303-.535-1.524.116-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.005.404 2.289-1.553 3.295-1.23 3.295-1.23.653 1.653.24 2.874.118 3.176.77.84 1.232 1.91 1.232 3.221 0 4.61-2.807 5.625-5.479 5.921.43.371.823 1.103.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.296 24 12 24 5.371 18.627 0 12 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="sm:hidden flex flex-col justify-center items-center w-10 h-10 rounded-md hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-foreground mb-1 transition-transform ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
            ></span>
            <span
              className={`block w-5 h-0.5 bg-foreground mb-1 transition-opacity ${isMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block w-5 h-0.5 bg-foreground transition-transform ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            ></span>
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      <div
        className={`sm:hidden absolute top-[90px] right-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border transform transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen
            ? "opacity-100 max-h-[300px] translate-y-0"
            : "opacity-0 max-h-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="p-4 flex flex-col gap-1">
          {isLoading ? (
            <>
              <NavItemSkeleton />
              <NavItemSkeleton />
              <div className="mt-2 h-12 bg-muted/60 animate-pulse rounded-md"></div>
            </>
          ) : (
            <>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/");
                }}
                className={`font-medium text-sm px-3 py-2 rounded-md ${location.pathname === "/" ? "bg-primary/10 text-primary dark:bg-primary/10 dark:text-white" : "hover:bg-muted transition-colors"}`}
              >
                {t("common.navPost")}
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation("/feature-request");
                }}
                className={`font-medium text-sm px-3 py-2 rounded-md ${location.pathname === "/feature-request" ? "bg-primary/10 text-primary dark:bg-primary/10 dark:text-white" : "hover:bg-muted transition-colors"}`}
              >
                {t("common.navFeatureRequest")}
              </a>

              {isAuthenticated && currentUser ? (
                <div
                  className="flex items-center gap-2 px-3 py-2 mt-2 cursor-pointer hover:bg-muted rounded-md transition-colors"
                  onClick={() => {
                    void navigate("/sign-in");
                    setIsMenuOpen(false);
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-base font-semibold text-primary">
                        {(
                          currentUser.displayName ||
                          currentUser.profile?.displayName ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-medium">
                    {currentUser.displayName ||
                      currentUser.profile?.displayName ||
                      "User"}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => void navigate("/sign-in")}
                  className="font-medium text-sm px-3 py-2 rounded-md bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 transition-all mt-2"
                >
                  {t("common.signIn")}
                </button>
              )}
            </>
          )}
          {/* Mobile theme toggle and GitHub link */}
          <div className="flex items-center gap-1 mt-4 pt-2 border-t border-border/50">
            <ThemeToggle />
            <a
              href="https://github.com/crossplatformkorea"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-md hover:bg-muted dark:hover:bg-muted transition-colors"
            >
              <svg className="w-5 h-5 text-foreground dark:text-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 0C5.371 0 0 5.371 0 12c0 5.303 3.438 9.8 8.205 11.387.6.111.793-.261.793-.579v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.73.083-.73 1.205.084 1.84 1.258 1.84 1.258 1.07 1.834 2.809 1.305 3.495.998.108-.775.418-1.305.76-1.605-2.665-.305-5.467-1.333-5.467-5.933 0-1.311.469-2.381 1.235-3.221-.123-.303-.535-1.524.116-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.046.138 3.005.404 2.289-1.553 3.295-1.23 3.295-1.23.653 1.653.24 2.874.118 3.176.77.84 1.232 1.91 1.232 3.221 0 4.61-2.807 5.625-5.479 5.921.43.371.823 1.103.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.296 24 12 24 5.371 18.627 0 12 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
