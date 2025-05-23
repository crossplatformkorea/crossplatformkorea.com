import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { ConvexReactClient } from 'convex/react';

// Provide a fallback URL for CI environment
const convexUrl =
  import.meta.env.VITE_CONVEX_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://enchanted-cuttlefish-433.convex.cloud'
    : 'https://localhost:3000');

const convex = new ConvexReactClient(convexUrl);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConvexAuthProvider client={convex}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </ConvexAuthProvider>
  </React.StrictMode>,
);
