import { ConvexError } from 'convex/values';
import i18next from 'i18next';

/**
 * Map a caught error to a message that is safe to show to end users.
 *
 * Production Convex redacts plain thrown server Errors to
 * "[CONVEX M(module:fn)] [Request ID: ...] Server Error", so a raw
 * `error.message` is never fit for the UI. Only a `ConvexError` payload
 * survives redaction, so server code raises user-actionable failures as
 * `new ConvexError(ErrorCode.X)` where the payload is an i18n key
 * (see `convex/constants.ts`).
 *
 * A payload that resolves to a translation is returned translated; anything
 * else — an unknown key, a plain Error, a network blip — falls back to the
 * caller's own translated message rather than leaking internals.
 */
export function userFacingErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ConvexError)) return fallback;

  const payload: unknown = error.data;
  if (typeof payload !== 'string' || payload.trim() === '') return fallback;

  // i18next echoes the key back when it has no entry for it, which would put a
  // dotted key path in front of the user.
  const translated = i18next.t(payload);
  return translated && translated !== payload ? translated : fallback;
}
