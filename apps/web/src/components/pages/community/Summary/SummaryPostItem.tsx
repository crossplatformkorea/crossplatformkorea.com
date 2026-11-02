import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ko, ja } from 'date-fns/locale';
import CategoryBadge from '@/components/uis/CategoryBadge';
import { cn } from '@/lib/utils';
import { motion, useReducedMotion } from 'framer-motion';
import { entranceEase, interactionSpring } from '@/lib/motion';

const MotionLink = motion.create(Link);

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  updatedAt: string;
  tags?: string[];
  thumbnail?: string;
  slug?: string;
}

export default function SummaryPostItem({
  post,
  featured = false,
  order = 0,
}: {
  post: Post;
  featured?: boolean;
  order?: number;
}) {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [failedThumbnail, setFailedThumbnail] = useState<string | null>(null);
  const plainContent = post.content
    .replace(/<[^>]*>/g, '')
    .replace(/[#*_>`~]/g, '')
    .trim();
  const preview = plainContent.length > 180 ? `${plainContent.slice(0, 180)}…` : plainContent;
  const language = i18n.language.split('-')[0];
  const locale = language === 'ko' ? ko : language === 'ja' ? ja : undefined;

  return (
    <MotionLink
      to={`/post/${post.slug || post._id}`}
      initial={false}
      whileInView={
        reduceMotion
          ? undefined
          : {
              opacity: [0.6, 1],
              transition: { duration: 0.45, ease: entranceEase, delay: order * 0.04 },
            }
      }
      viewport={{ once: true, amount: 0.1 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985, transition: interactionSpring }}
      className={cn(
        'surface-card group flex flex-col overflow-hidden transition-colors duration-200 hover:border-foreground/40',
        featured && 'border-foreground/25 bg-muted/40',
      )}
    >
      {post.thumbnail && failedThumbnail !== post.thumbnail && (
        <div className="h-32 overflow-hidden border-b border-border/70">
          <img
            src={post.thumbnail}
            alt=""
            loading="lazy"
            onError={() => setFailedThumbnail(post.thumbnail || null)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <CategoryBadge category={post.category} />
          <time
            dateTime={post.updatedAt}
            className="whitespace-nowrap text-xs text-muted-foreground"
          >
            {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true, locale })}
          </time>
        </div>

        <h3 className="mt-5 line-clamp-2 text-lg font-bold leading-snug tracking-[-0.025em]">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{preview}</p>

        {post.tags && post.tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label={t('common.tags')}>
            {post.tags.slice(0, 3).map((tag, index) => (
              <li
                // Tags are not deduplicated on the server.
                key={`${tag}-${index}`}
                className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                #{tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </MotionLink>
  );
}
