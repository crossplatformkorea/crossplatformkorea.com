import type { ReactNode } from 'react';
import TypingHeading from './TypingHeading';

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
  return (
    <header className="journal-header">
      <div className="section-kicker">{eyebrow}</div>
      <div className="mt-5 grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <TypingHeading className="journal-title">{title}</TypingHeading>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
        {action && <div className="flex shrink-0 items-center">{action}</div>}
      </div>
      {aside && <div className="mt-8 border-t border-border/70 pt-5 sm:mt-10">{aside}</div>}
    </header>
  );
}
