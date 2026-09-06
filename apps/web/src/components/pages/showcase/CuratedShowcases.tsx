import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Search } from 'lucide-react';
import { Button } from '../../uis/Button';
import { cn } from '@/lib/utils';
import { curatedApps } from './catalog-data';
import {
  catalogCategories,
  filterCuratedApps,
  technologies,
  technologyNames,
  type CuratedApp,
} from './catalog';

function AppCard({ app }: { app: CuratedApp }) {
  const { t, i18n } = useTranslation();
  const language = i18n.language.startsWith('ko') ? 'ko' : 'en';
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <article className="surface-card flex min-w-0 flex-col p-5">
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center text-lg font-semibold text-gray-700 dark:text-gray-300"
          aria-hidden="true"
        >
          {app.imageUrl && !imageFailed ? (
            <img
              src={app.imageUrl}
              alt=""
              width={48}
              height={48}
              loading="lazy"
              decoding="async"
              className="h-full w-full rounded-xl object-cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            app.name.slice(0, 2)
          )}
        </div>
        <div className="min-w-0">
          <h2 className="break-words text-base font-bold text-gray-950 dark:text-gray-50">
            {app.name}
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{app.publisher}</p>
        </div>
      </div>
      <div className="mb-3 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
        <span className="rounded-md border border-gray-200 px-2 py-1 dark:border-gray-700">
          {technologyNames[app.technology]}
        </span>
        <span className="py-1">{t(`showcase.catalog.categories.${app.category}`)}</span>
      </div>
      <p lang={language} className="mb-5 text-sm leading-6 text-gray-600 dark:text-gray-300">
        {app.description[language]}
      </p>
      <div className="mt-auto border-t border-gray-200 pt-4 dark:border-gray-700">
        <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
          {t(`showcase.catalog.scopes.${app.scope}`)}
        </p>
        <p lang={language} className="text-sm leading-6 text-gray-700 dark:text-gray-300">
          {app.adoption[language]}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <a
            href={app.source.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${app.name} — ${t('showcase.catalog.source')}`}
            title={app.source.title}
            className="inline-flex items-center gap-1 font-medium underline decoration-gray-300 underline-offset-4 hover:decoration-current"
          >
            {t('showcase.catalog.source')}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          {app.websiteUrl && (
            <a
              href={app.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${app.name} — ${t('showcase.catalog.website')}`}
              className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              {t('showcase.catalog.website')}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          {t('showcase.catalog.reviewed', { date: app.reviewedAt })}
        </p>
      </div>
    </article>
  );
}

export default function CuratedShowcases() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const technology = technologies.find((item) => item === params.get('tech')) || '';
  const category = catalogCategories.find((item) => item === params.get('category')) || '';
  // Keying the result list resets pagination for filters and browser back/forward.
  const apps = filterCuratedApps(curatedApps, { query, technology, category });
  const update = (key: string, value: string) => {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  };
  const reset = () =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        ['q', 'tech', 'category'].forEach((key) => next.delete(key));
        return next;
      },
      { replace: true },
    );

  return (
    <section aria-label={t('showcase.catalog.curated')}>
      <p className="mb-6 max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">
        {t('showcase.catalog.intro')}
      </p>
      <div
        className="mb-5 flex flex-wrap gap-2"
        role="group"
        aria-label={t('showcase.catalog.technology')}
      >
        {(['', ...technologies] as const).map((tech) => (
          <Button
            key={tech}
            variant="outline"
            size="sm"
            aria-pressed={technology === tech}
            onClick={() => update('tech', tech)}
            className={cn(
              technology === tech &&
                'border-gray-500 bg-gray-100 dark:border-gray-400 dark:bg-gray-800',
            )}
          >
            {tech ? technologyNames[tech] : t('showcase.catalog.all')}
            <span className="ml-1 text-gray-500 dark:text-gray-400">
              {tech
                ? curatedApps.filter((app) => app.technology === tech).length
                : curatedApps.length}
            </span>
          </Button>
        ))}
      </div>
      <div className="surface-card mb-5 flex flex-col gap-3 p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-3.5 text-gray-400"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => update('q', event.target.value)}
            aria-label={t('showcase.catalog.search')}
            placeholder={t('showcase.catalog.search')}
            className="field-control h-11 pl-10"
          />
        </div>
        <select
          value={category}
          onChange={(event) => update('category', event.target.value)}
          aria-label={t('showcase.allCategories')}
          className="field-control h-11 sm:max-w-48"
        >
          <option value="">{t('showcase.allCategories')}</option>
          {catalogCategories.map((item) => (
            <option key={item} value={item}>
              {t(`showcase.catalog.categories.${item}`)}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-5 flex items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
        <p role="status">{t('showcase.catalog.results', { count: apps.length })}</p>
        {(query || technology || category) && (
          <Button variant="ghost" size="sm" onClick={reset}>
            {t('showcase.catalog.reset')}
          </Button>
        )}
      </div>
      <CatalogResults key={`${query}|${technology}|${category}`} apps={apps} />
    </section>
  );
}

function CatalogResults({ apps }: { apps: CuratedApp[] }) {
  const { t } = useTranslation();
  const [limit, setLimit] = useState(12);
  return apps.length ? (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {apps.slice(0, limit).map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
      {limit < apps.length && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" onClick={() => setLimit((value) => value + 12)}>
            {t('showcase.catalog.more', {
              shown: Math.min(limit, apps.length),
              total: apps.length,
            })}
          </Button>
        </div>
      )}
    </>
  ) : (
    <div className="surface-card p-12 text-center">
      <h2 className="font-bold">{t('showcase.noSearchResults')}</h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t('showcase.tryAdjusting')}</p>
    </div>
  );
}
