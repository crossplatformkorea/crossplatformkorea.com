import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './components/pages';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './providers/AuthProvider';

export default function App() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('common.appName');
  }, [t]);

  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}
