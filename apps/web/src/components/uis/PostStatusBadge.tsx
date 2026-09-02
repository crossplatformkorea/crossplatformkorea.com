import { CalendarClock, FileText } from 'lucide-react';
import { resolvePostStatus, type PostVisibilityFields } from '@convex/posts/visibility';
import { cn } from '@/lib/utils';
import { t, getLocale } from '@/lib/i18n';

const LOCALE_TAGS = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP' } as const;

/** Render a scheduled `publishAt` in the reader's locale, in Seoul time. */
function formatPublishAt(publishAt: string | undefined): string | null {
  if (!publishAt) return null;
  const ms = Date.parse(publishAt);
  if (Number.isNaN(ms)) return null;

  return new Date(ms).toLocaleString(LOCALE_TAGS[getLocale()], {
    timeZone: 'Asia/Seoul',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface PostStatusBadgeProps {
  post: PostVisibilityFields;
  className?: string;
}

/**
 * Marks a post that is not publicly visible yet. Renders nothing for a
 * published post, so lists that mix both stay uncluttered — only the author
 * ever receives drafts and scheduled rows from the server.
 */
export default function PostStatusBadge({ post, className }: PostStatusBadgeProps) {
  const status = resolvePostStatus({ status: post.status, publishAt: post.publishAt });
  if (status === 'published') return null;

  const when = status === 'scheduled' ? formatPublishAt(post.publishAt) : null;
  const Icon = status === 'scheduled' ? CalendarClock : FileText;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium',
        status === 'scheduled'
          ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
          : 'border-border bg-muted text-muted-foreground',
        className,
      )}
    >
      <Icon size={12} />
      {when ? t('posts.status.scheduledFor', { when }) : t(`posts.status.${status}`)}
    </span>
  );
}
