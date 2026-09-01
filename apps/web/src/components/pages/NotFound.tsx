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
    <div className="surface-card relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* 404 Animation/Icon */}
      <div className="relative mb-8">
        <div className="select-none font-mono text-8xl font-bold tracking-[-0.08em] text-primary/20">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Search size={40} className="text-muted-foreground animate-pulse" />
        </div>
      </div>

      {/* Error Content */}
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-3">{t('errors.notFound.title')}</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {t('errors.notFound.description')}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleGoHome}
            className={cn(
              'flex items-center gap-2 px-6 py-2.5',
              'bg-primary text-primary-foreground hover:bg-primary/90 dark:border dark:border-border/80 dark:bg-muted dark:text-foreground dark:hover:bg-muted/80',
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
        <p className="text-sm text-muted-foreground/60">{t('errors.notFound.suggestion')}</p>
      </div>

      <span className="pointer-events-none absolute -bottom-20 right-0 font-mono text-[18rem] font-black italic leading-none text-primary/10">
        /
      </span>
    </div>
  );
}
