/**
 * When a post appeared to readers.
 *
 * `publishedAt` is set as a post goes public. For a scheduled post that is its
 * scheduled time, often weeks after it was created, so labelling it with
 * `_creationTime` would show the newest post in the feed as weeks old — and
 * would hand search engines that wrong date as `datePublished`. Falls back to
 * creation time for rows written before `publishedAt` existed.
 */
export function postPublishedTime(post: { publishedAt?: number; _creationTime: number }): number {
  return post.publishedAt ?? post._creationTime;
}
