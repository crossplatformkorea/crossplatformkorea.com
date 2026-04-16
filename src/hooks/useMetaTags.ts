import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface MetaTagsConfig {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  /** Attach to `<meta name="author">`. Shown by some LLMs as the cite-able source. */
  author?: string;
  /** ISO 8601 string, article:published_time. */
  publishedTime?: string;
  /** ISO 8601 string, article:modified_time. */
  modifiedTime?: string;
  /** article:section — typically the post category. */
  articleSection?: string;
  /** article:tag — one entry per tag. */
  articleTags?: string[];
  /** If true, emits `<meta name="robots" content="noindex, nofollow">`. */
  noindex?: boolean;
}

export function useMetaTags(config?: MetaTagsConfig) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Title
    const title = config?.title || t('common.appName');
    document.title = title;

    // Standard meta
    const description = config?.description || t('meta.description');
    updateMetaTag('description', description);

    const keywords = config?.keywords || t('meta.keywords');
    updateMetaTag('keywords', keywords);

    if (config?.author) {
      updateMetaTag('author', config.author);
    }

    updateMetaTag('robots', config?.noindex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    updateMetaTag('og:title', config?.ogTitle || title);
    updateMetaTag('og:description', config?.ogDescription || description);
    updateMetaTag('og:locale', i18n.language);
    updateMetaTag('og:type', config?.ogType || 'website');
    updateMetaTag('og:site_name', t('common.appName'));

    if (config?.ogImage) {
      updateMetaTag('og:image', absoluteUrl(config.ogImage));
      updateMetaTag('og:image:alt', config.ogTitle || title);
    }
    if (config?.ogUrl) {
      updateMetaTag('og:url', absoluteUrl(config.ogUrl));
    }

    if (config?.ogType === 'article') {
      if (config.publishedTime) {
        updateMetaTag('article:published_time', config.publishedTime);
      }
      if (config.modifiedTime) {
        updateMetaTag('article:modified_time', config.modifiedTime);
      }
      if (config.articleSection) {
        updateMetaTag('article:section', config.articleSection);
      }
      if (config.author) {
        updateMetaTag('article:author', config.author);
      }
      replaceAllMetaTags('article:tag', config.articleTags ?? []);
    } else {
      removeMetaTag('article:published_time');
      removeMetaTag('article:modified_time');
      removeMetaTag('article:section');
      removeMetaTag('article:author');
      replaceAllMetaTags('article:tag', []);
    }

    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', config?.twitterTitle || config?.ogTitle || title);
    updateMetaTag(
      'twitter:description',
      config?.twitterDescription || config?.ogDescription || description,
    );
    if (config?.twitterImage || config?.ogImage) {
      updateMetaTag('twitter:image', absoluteUrl((config?.twitterImage || config?.ogImage)!));
    }

    // Canonical link
    updateCanonical(config?.canonical);

    // html lang
    document.documentElement.lang = i18n.language;
  }, [config, t, i18n.language]);
}

function absoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  if (typeof window === 'undefined') return url;
  return `${window.location.origin}${url.startsWith('/') ? url : `/${url}`}`;
}

function updateMetaTag(name: string, content: string) {
  const isProperty =
    name.startsWith('og:') || name.startsWith('twitter:') || name.startsWith('article:');
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;

  let metaTag = document.querySelector<HTMLMetaElement>(selector);

  if (!metaTag) {
    metaTag = document.createElement('meta');
    if (isProperty) {
      metaTag.setAttribute('property', name);
    } else {
      metaTag.setAttribute('name', name);
    }
    document.head.appendChild(metaTag);
  }

  metaTag.content = content;
}

function removeMetaTag(name: string) {
  const isProperty =
    name.startsWith('og:') || name.startsWith('twitter:') || name.startsWith('article:');
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  document.querySelectorAll(selector).forEach((el) => el.remove());
}

function replaceAllMetaTags(name: string, values: string[]) {
  // article:tag can repeat — remove all existing, then append the new set.
  removeMetaTag(name);
  for (const value of values) {
    const meta = document.createElement('meta');
    meta.setAttribute('property', name);
    meta.content = value;
    document.head.appendChild(meta);
  }
}

function updateCanonical(href?: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    // Default to the current URL without query string when no override is given.
    href = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : undefined;
  }
  if (!href) return;

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = absoluteUrl(href);
}
