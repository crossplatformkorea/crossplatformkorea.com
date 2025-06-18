import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './components/pages';
import { AuthProvider } from './providers/AuthProvider';
import { useMetaTags } from './hooks/useMetaTags';

export default function App() {
  // Set default meta tags for the entire app (includes title)
  useMetaTags();

  return (
    <div className="h-full">
      <Router>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </Router>
    </div>
  );
}
