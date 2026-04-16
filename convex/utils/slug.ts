/**
 * Generate a URL-safe slug from a title.
 *
 * - Preserves Korean/CJK characters (they are URL-safe after encoding and
 *   Google indexes them natively — removing them would leave empty slugs for
 *   pure-Korean titles).
 * - Lowercases latin chars, collapses whitespace and punctuation to a single
 *   dash, and trims dashes at the ends.
 * - Caps length at 80 visible chars to keep URLs short.
 * - Appends a base-36 timestamp + random suffix. In Convex, `Date.now()`
 *   returns the same value for the entire mutation, so two posts generated in
 *   the same batch (e.g. `backfillSlugs`) would collide on the timestamp
 *   alone. The random segment makes that practically impossible and keeps the
 *   slug unique even under concurrent writes.
 */
export function generateSlug(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    // drop characters that are neither word chars, CJK, whitespace, nor dash
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    // collapse any run of whitespace or dashes to a single dash
    .replace(/[\s-]+/g, '-')
    // trim leading/trailing dashes
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  const suffix = `${timestamp}${random}`;
  return base ? `${base}-${suffix}` : suffix;
}
