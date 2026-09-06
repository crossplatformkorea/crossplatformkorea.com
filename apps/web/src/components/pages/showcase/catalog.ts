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
