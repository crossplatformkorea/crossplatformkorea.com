import { useSyncExternalStore } from 'react';

// Matches the header surface (--card) so the browser chrome blends into it.
const themeColors = { light: '#ffffff', dark: '#141414' } as const;

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

/**
 * The resolved theme. index.html sets the `dark`/`light` class before React
 * mounts, so the first render is already correct.
 */
export function useIsDarkTheme() {
  return useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.classList.contains('dark'),
    () => false,
  );
}

export function applyTheme(isDark: boolean) {
  const html = document.documentElement;
  html.classList.toggle('dark', isDark);
  html.classList.toggle('light', !isDark);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', isDark ? themeColors.dark : themeColors.light);
}
