import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../uis/Button';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoHome = () => {
    void navigate('/');
  };

  const handleGoBack = () => {
    void navigate(-1);
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      {/* 404 Animation/Icon */}
      <div className="relative mb-8">
        <div className="text-8xl font-bold text-primary/20 select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Search size={40} className="text-muted-foreground animate-pulse" />
        </div>
      </div>

      {/* Error Content */}
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-3">
          {t('errors.notFound.title')}
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {t('errors.notFound.description')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleGoHome}
            className={cn(
              'flex items-center gap-2 px-6 py-2.5',
              'bg-primary hover:bg-primary/90 text-primary-foreground'
            )}
          >
            <Home size={18} />
            {t('errors.notFound.goHome')}
          </Button>
          
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="flex items-center gap-2 px-6 py-2.5"
          >
            <ArrowLeft size={18} />
            {t('common.back')}
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground/60">
          {t('errors.notFound.suggestion')}
        </p>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-primary/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/2 w-16 h-16 bg-primary/5 rounded-full animate-pulse delay-500" />
      </div>
    </div>
  );
}