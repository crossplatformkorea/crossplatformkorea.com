export const technologies = ['react-native', 'flutter', 'kmp'] as const;
export type Technology = (typeof technologies)[number];
export const technologyNames: Record<Technology, string> = {
  'react-native': 'React Native',
  flutter: 'Flutter',
  kmp: 'Kotlin Multiplatform',
};
export const catalogCategories = [
  'finance',
  'commerce',
  'productivity',
  'social',
  'entertainment',
  'travel',
  'health',
  'education',
  'utilities',
  'developer',
] as const;
export type CatalogCategory = (typeof catalogCategories)[number];
export interface CuratedApp {
  id: string;
  name: string;
  publisher: string;
  technology: Technology;
  category: CatalogCategory;
  scope: 'app' | 'features' | 'shared-logic' | 'listed';
  description: { ko: string; en: string };
  adoption: { ko: string; en: string };
  source: { title: string; url: string };
  reviewedAt: string;
  imageUrl: string;
  imageSourceUrl: string;
  websiteUrl?: string;
}
const aliases: Record<Technology, string> = {
  'react-native': 'rn react native 리액트 네이티브',
  flutter: 'flutter 플러터 フラッター',
  kmp: 'kmp kmm kotlin multiplatform 코틀린 멀티플랫폼 コトリン',
};
const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase();
export function filterCuratedApps(
  apps: readonly CuratedApp[],
  {
    query = '',
    technology = '',
    category = '',
  }: { query?: string; technology?: string; category?: string },
): CuratedApp[] {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return apps.filter((app) => {
    if (technology && app.technology !== technology) return false;
    if (category && app.category !== category) return false;
    const text = normalize(
      [
        app.name,
        app.publisher,
        aliases[app.technology],
        app.description.ko,
        app.description.en,
        app.adoption.ko,
        app.adoption.en,
      ].join(' '),
    );
    return terms.every((term) => {
      if (term === 'rn') return app.technology === 'react-native';
      if (term === 'kmp' || term === 'kmm') return app.technology === 'kmp';
      return text.includes(term);
    });
  });
}

export interface StoreMetrics {
  sourceUrl: string;
  storeName: string;
  publisher: string;
  region: string;
  checkedAt: string;
  ratingCount: number;
  downloadsLowerBound: number;
}

/** Compare reach without letting raw download magnitudes overwhelm ratings. */
export function popularityScore(metrics: StoreMetrics): number {
  return (
    0.7 * Math.log10(1 + metrics.ratingCount) + 0.3 * Math.log10(1 + metrics.downloadsLowerBound)
  );
}

export function rankCuratedApps(
  apps: readonly CuratedApp[],
  metrics: Readonly<Record<string, StoreMetrics>>,
): CuratedApp[] {
  // Stable ties and unmeasured apps retain the editorial order. Never mutate it.
  return [...apps].sort((a, b) => {
    const left = metrics[a.id];
    const right = metrics[b.id];
    if (!left) return right ? 1 : 0;
    if (!right) return -1;
    return popularityScore(right) - popularityScore(left);
  });
}
