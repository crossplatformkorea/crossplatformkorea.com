import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState<boolean>(false);
  
  // Initialize on mount
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                       (localStorage.theme === 'dark') ||
                       (!('theme' in localStorage) && 
                        window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDark(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={cn(
        "rounded-full p-2 transition-colors hover:bg-accent",
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        {/* Moon icon for dark mode */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "h-5 w-5 transition-opacity duration-300",
            isDark ? "opacity-100" : "opacity-0"
          )}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
        
        {/* Sun icon for light mode */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "h-5 w-5 transition-opacity duration-300",
            !isDark ? "opacity-100" : "opacity-0"
          )}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </div>
    </button>
  );
}
