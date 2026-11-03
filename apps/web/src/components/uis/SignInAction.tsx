import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { createSignInHref } from '../../lib/authRedirect';
import { cn } from '../../lib/utils';
import { buttonStyles } from './buttonStyles';

export default function SignInAction({
  returnTo,
  children,
  className,
}: {
  returnTo: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={createSignInHref(returnTo)}
      className={buttonStyles({
        variant: 'outline',
        className: cn(
          'inline-grid h-auto min-h-11 min-w-[12.5rem] max-w-full grid-cols-[1rem_minmax(0,1fr)] gap-2 motion-reduce:transition-none',
          className,
        ),
      })}
    >
      <LogIn size={16} aria-hidden="true" />
      <span className="min-w-0 text-center">{children}</span>
    </Link>
  );
}
