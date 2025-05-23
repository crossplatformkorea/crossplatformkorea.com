import { BrowserRouter as Router } from 'react-router-dom';
import AppLayout from './components/pages';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AuthStateListener from './components/AuthStateListener';

export default function App() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('common.appName');
  }, [t]);

  return (
    <Router>
      <AuthStateListener />
      <AppLayout />
    </Router>
  );
}
