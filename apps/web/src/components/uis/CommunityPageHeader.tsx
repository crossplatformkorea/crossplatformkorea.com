import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { revealVariants } from '@/lib/motion';

export default function CommunityPageHeader({
  eyebrow,
  title,
  description,
  action,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  action?: ReactNode;
  aside?: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.header
      className="journal-header"
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      variants={revealVariants}
    >
      <div className="section-kicker">
        <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
        {eyebrow}
      </div>
      <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <h1 className="journal-title">{title}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
        {action && <div className="flex shrink-0 items-center">{action}</div>}
      </div>
      {aside && <div className="mt-8 border-t border-border/70 pt-5 sm:mt-10">{aside}</div>}
    </motion.header>
  );
}
