import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import TypingHeading from './TypingHeading';

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('page-hero', className)}>
      <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          {eyebrow && <div className="section-kicker">{eyebrow}</div>}
          <TypingHeading className="page-title">{title}</TypingHeading>
          {description && <div className="page-description">{description}</div>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
