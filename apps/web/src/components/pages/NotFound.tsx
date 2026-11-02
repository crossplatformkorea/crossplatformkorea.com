import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../uis/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="surface-card relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-4 py-12">
      <p className="mb-6 select-none text-8xl font-bold tracking-[-0.06em] text-primary/20 tabular-nums">
        404
      </p>

      <div className="max-w-md text-center">
        <h1 className="mb-3 text-balance text-2xl font-bold text-foreground">
          {t('errors.notFound.title')}
        </h1>
        <p className="mb-8 text-pretty leading-relaxed text-muted-foreground">
          {t('errors.notFound.description')}
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/" className="home-primary-link gap-2">
            <Home size={18} />
            {t('errors.notFound.goHome')}
          </Link>
          {/* History can't be a link target; on a direct visit there is nowhere to go back to. */}
          {window.history.length > 1 && (
            <Button onClick={() => void navigate(-1)} variant="outline" className="min-h-11 px-5">
              <ArrowLeft size={18} />
              {t('common.back')}
            </Button>
          )}
        </div>
      </div>

      <p className="mt-12 text-center text-sm text-muted-foreground">
        {t('errors.notFound.suggestion')}
      </p>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-0 text-[18rem] font-black italic leading-none text-primary/10"
      >
        /
      </span>
    </div>
  );
}
