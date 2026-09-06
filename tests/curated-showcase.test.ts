import { describe, expect, test } from 'bun:test';
import { curatedApps } from '../apps/web/src/components/pages/showcase/catalog-data';
import {
  catalogCategories,
  filterCuratedApps,
} from '../apps/web/src/components/pages/showcase/catalog';

describe('CPK editorial showcase', () => {
  test('contains 100 distinct evidenced entries with complete bilingual copy', () => {
    expect(curatedApps).toHaveLength(100);
    expect(new Set(curatedApps.map((app) => app.id)).size).toBe(100);
    expect(new Set(curatedApps.map((app) => app.name)).size).toBe(100);
    for (const app of curatedApps) {
      expect(app.id).toMatch(/^[a-z0-9-]+$/);
      expect(catalogCategories).toContain(app.category);
      expect(app.publisher.length).toBeGreaterThan(0);
      for (const language of ['ko', 'en'] as const) {
        expect(app.description[language].length).toBeGreaterThan(20);
        expect(app.adoption[language].length).toBeGreaterThan(10);
      }
      expect(app.source.title.length).toBeGreaterThan(0);
      expect(app.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      for (const link of [app.source.url, app.imageUrl, app.websiteUrl].filter(Boolean)) {
        const url = new URL(link!);
        expect(url.protocol).toBe('https:');
        expect(url.username + url.password).toBe('');
      }
      // Editorial examples must never masquerade as a member's submission.
      expect(app).not.toHaveProperty('userId');
      expect(app).not.toHaveProperty('likes');
    }
  });

  test('filters each technology without matching aliases inside unrelated words', () => {
    for (const [technology, count, aliases] of [
      ['react-native', 35, ['RN', '리액트 네이티브']],
      ['flutter', 40, ['Flutter', '플러터']],
      ['kmp', 25, ['KMP', 'KMM', '코틀린']],
    ] as const) {
      expect(filterCuratedApps(curatedApps, { technology })).toHaveLength(count);
      for (const query of aliases) {
        const result = filterCuratedApps(curatedApps, { query });
        expect(result).toHaveLength(count);
        expect(result.every((app) => app.technology === technology)).toBe(true);
      }
    }
  });

  test('combines company, Korean search, technology and category', () => {
    expect(
      filterCuratedApps(curatedApps, {
        query: '  토스  ',
        technology: 'react-native',
        category: 'finance',
      }).map((app) => app.id),
    ).toEqual(['toss']);
    expect(
      filterCuratedApps(curatedApps, { query: 'RN Shopify', category: 'commerce' }),
    ).toHaveLength(4);
    expect(filterCuratedApps(curatedApps, { query: '토스', technology: 'flutter' })).toEqual([]);
    expect(filterCuratedApps(curatedApps, { query: 'nonexistent-app-1234' })).toEqual([]);
    expect(filterCuratedApps(curatedApps, { query: '  ' })).toEqual(curatedApps);
  });

  test('preserves the scope of easily confused adoption examples', () => {
    const find = (id: string) => curatedApps.find((app) => app.id === id)!;
    expect(find('toss').scope).toBe('features');
    expect(find('netflix-studio').scope).toBe('shared-logic');
    expect(find('netflix-studio').name).toContain('Studio');
    expect(find('kride').name).toBe('k.ride');
    expect(find('wolt-merchant').name).toBe('Wolt Merchant');
    expect(find('instagram-quest').name).toContain('Quest');
    expect(find('baidu-wonder').name).toContain('Wonder');
  });
});
