import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppWindow, ArrowUpRight, Edit, User } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../../uis/Button';
import { cn, createUserProfileLink } from '@/lib/utils';
import { scrollRevealVariants } from '@/lib/motion';
import { Doc } from '@convex/_generated/dataModel';
import { useTranslation } from 'react-i18next';
import LikeButton from '../../uis/LikeButton';

export type ShowcaseItemType = Doc<'showcases'> & {
  categoryName?: string;
  otherLinks?: string | string[];
  author?: { _id: string; name: string; avatarUrl?: string };
};

interface ShowcaseItemProps {
  showcase: ShowcaseItemType;
  isEditable?: boolean;
  onEditClick?: () => void;
  className?: string;
}

export default function ShowcaseItem({
  showcase,
  isEditable,
  onEditClick,
  className,
}: ShowcaseItemProps) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [imageFailed, setImageFailed] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  useEffect(() => {
    setImageFailed(false);
  }, [showcase.imageUrl]);
  useEffect(() => {
    setAvatarFailed(false);
  }, [showcase.author?.avatarUrl]);
  const otherLinks = (
    typeof showcase.otherLinks === 'string'
      ? showcase.otherLinks.split(',')
      : showcase.otherLinks || []
  )
    .map((link) => link.trim())
    .filter(Boolean);
  const links = [
    { url: showcase.websiteUrl, label: t('showcase.website') },
    { url: showcase.appStoreUrl, label: t('showcase.appStore') },
    { url: showcase.playStoreUrl, label: t('showcase.playStore') },
  ];

  return (
    <motion.article
      className={cn('collection-card', className)}
      initial={false}
      whileInView={reducedMotion ? undefined : 'visible'}
      variants={scrollRevealVariants}
      viewport={{ once: true, amount: 0.12 }}
    >
      <div className="group relative aspect-[16/10] overflow-hidden border-b border-border/60 bg-muted/40">
        {showcase.imageUrl && !imageFailed ? (
          <img
            src={showcase.imageUrl}
            alt={showcase.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <AppWindow size={40} className="text-muted-foreground/50" aria-hidden="true" />
          </div>
        )}
        {showcase.featured && (
          <span className="absolute right-3 top-3 rounded-lg border border-border/70 bg-background/95 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider backdrop-blur">
            {t('showcase.featured')}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="min-w-0 break-words font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {showcase.categoryName || showcase.category}
          </span>
          {isEditable && (
            <Button
              onClick={onEditClick}
              variant="ghost"
              size="icon"
              className="min-h-11 min-w-11 shrink-0 text-muted-foreground"
              aria-label={t('showcase.form.edit')}
            >
              <Edit size={15} />
            </Button>
          )}
        </div>
        <h2 className="break-words text-xl font-semibold leading-snug tracking-[-0.035em]">
          {showcase.title}
        </h2>
        <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-muted-foreground">
          {showcase.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {links.map(
            ({ url, label }) =>
              url && (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="collection-link"
                  aria-label={`${showcase.title} — ${label}`}
                >
                  {label}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ),
          )}
        </div>
        {otherLinks.length > 0 && (
          <details className="mt-3 text-xs text-muted-foreground">
            <summary className="min-h-11 cursor-pointer py-3 font-medium">
              {t('showcase.otherLinksButton')} ({otherLinks.length})
            </summary>
            <div className="grid gap-1">
              {otherLinks.map((link, index) => (
                <a
                  key={index}
                  href={/^https?:\/\//i.test(link) ? link : `https://${link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-2 rounded-lg border border-border/60 px-3 py-2 hover:bg-muted/60"
                >
                  <span className="min-w-0 flex-1 break-all">
                    {link.replace(/^https?:\/\//i, '')}
                  </span>
                  <ArrowUpRight size={14} className="shrink-0" aria-hidden="true" />
                </a>
              ))}
            </div>
          </details>
        )}
        {showcase.tags && showcase.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {showcase.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="max-w-full break-words rounded-md bg-muted/50 px-2 py-1 font-mono text-[10px] text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
            {showcase.tags.length > 3 && (
              <span className="py-1 text-[10px] text-muted-foreground">
                +{showcase.tags.length - 3}
              </span>
            )}
          </div>
        )}
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            {showcase.author?.name ? (
              <Link
                to={createUserProfileLink(showcase.author.name)}
                className="flex min-h-11 min-w-0 items-center gap-2 hover:text-foreground"
              >
                {showcase.author.avatarUrl && !avatarFailed ? (
                  <img
                    src={showcase.author.avatarUrl}
                    alt=""
                    className="h-6 w-6 shrink-0 rounded-full border border-border object-cover"
                    loading="lazy"
                    onError={() => setAvatarFailed(true)}
                  />
                ) : (
                  <User size={16} className="shrink-0" aria-hidden="true" />
                )}
                <span className="truncate">{showcase.author.name}</span>
              </Link>
            ) : (
              <span className="flex items-center gap-2">
                <User size={16} aria-hidden="true" />
                {t('showcase.user')}
              </span>
            )}
            <LikeButton
              postId={showcase._id}
              type="showcases"
              showCount
              size="sm"
              className="!min-h-11 !min-w-11 shrink-0 !px-2"
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
