import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './components/pages';
import { AuthProvider } from './providers/AuthProvider';
import { useMetaTags } from './hooks/useMetaTags';
import { ErrorBoundary } from './components/uis/ErrorBoundary';
import { MotionConfig } from 'framer-motion';

export default function App() {
  // Set default meta tags for the entire app (includes title)
  useMetaTags();

  return (
    <MotionConfig reducedMotion="user">
      <div className="h-full">
        <ErrorBoundary>
          <Router>
            <AuthProvider>
              <AppLayout />
            </AuthProvider>
          </Router>
        </ErrorBoundary>
      </div>
    </MotionConfig>
  );
}
