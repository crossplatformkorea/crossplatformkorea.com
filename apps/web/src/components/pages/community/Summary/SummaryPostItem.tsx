import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ko, ja } from 'date-fns/locale';
import { ArrowUpRight, Clock } from 'lucide-react';
import CategoryBadge from '@/components/uis/CategoryBadge';

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

export default function SummaryPostItem({ post }: { post: Post }) {
  const { i18n } = useTranslation();
  const plainContent = post.content
    .replace(/<[^>]*>/g, '')
    .replace(/[#*_>`~]/g, '')
    .trim();
  const preview = plainContent.length > 180 ? `${plainContent.slice(0, 180)}…` : plainContent;
  const locale = i18n.language === 'ko' ? ko : i18n.language === 'ja' ? ja : undefined;

  return (
    <Link
      to={`/post/${post.slug || post._id}`}
      className="surface-card-interactive group flex min-h-64 flex-col overflow-hidden"
    >
      {post.thumbnail && (
        <div className="h-32 overflow-hidden border-b border-border/70">
          <img
            src={post.thumbnail}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <CategoryBadge category={post.category} />
          <span className="flex items-center gap-1.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
            <Clock size={11} />
            {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true, locale })}
          </span>
        </div>

        <h3 className="mt-5 line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.025em] transition group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{preview}</p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/70 pt-4">
          <span className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            {post.tags?.slice(0, 2).join(' / ') || 'COMMUNITY'}
          </span>
          <ArrowUpRight
            size={17}
            className="shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </Link>
  );
}
