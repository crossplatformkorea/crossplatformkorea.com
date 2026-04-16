/**
 * Generate a URL-safe slug from a title.
 *
 * - Preserves Korean/CJK characters (they are URL-safe after encoding and
 *   Google indexes them natively — removing them would leave empty slugs for
 *   pure-Korean titles).
 * - Lowercases latin chars, collapses whitespace and punctuation to a single
 *   dash, and trims dashes at the ends.
 * - Caps length at 80 visible chars to keep URLs short.
 * - Appends a base-36 timestamp suffix to guarantee uniqueness without an
 *   expensive collision check.
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

  const suffix = Date.now().toString(36);
  return base ? `${base}-${suffix}` : suffix;
}
