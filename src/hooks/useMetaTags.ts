import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface MetaTagsConfig {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}

export function useMetaTags(config?: MetaTagsConfig) {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Update document title - use custom title or fallback to app name
    const title = config?.title || t('common.appName');
    document.title = title;

    // Update meta description
    const description = config?.description || t('meta.description');
    updateMetaTag('description', description);

    // Update meta keywords
    const keywords = config?.keywords || t('meta.keywords');
    updateMetaTag('keywords', keywords);

    // Update Open Graph tags
    updateMetaTag('og:title', config?.ogTitle || title);
    updateMetaTag('og:description', config?.ogDescription || description);
    updateMetaTag('og:locale', i18n.language);
    
    if (config?.ogImage) {
      updateMetaTag('og:image', config.ogImage);
    }

    // Update Twitter Card tags
    updateMetaTag('twitter:title', config?.twitterTitle || title);
    updateMetaTag('twitter:description', config?.twitterDescription || description);

    // Update html lang attribute
    document.documentElement.lang = i18n.language;
  }, [config, t, i18n.language]);
}

function updateMetaTag(name: string, content: string) {
  // Handle property-based meta tags (og:, twitter:)
  const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  
  let metaTag = document.querySelector(selector) as HTMLMetaElement;
  
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
