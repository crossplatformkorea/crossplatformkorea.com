import * as React from 'react';
import { cn } from '../../lib/utils';

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'danger'
  | 'success'
  | 'auth';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition duration-200',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20',
        'disabled:pointer-events-none disabled:opacity-45',
        variant === 'default' &&
          'bg-primary text-primary-foreground shadow-[0_12px_28px_-16px_hsl(var(--primary))] hover:-translate-y-0.5 hover:bg-primary/90 dark:border dark:border-border/80 dark:bg-muted dark:text-foreground dark:shadow-none dark:hover:bg-muted/80',
        variant === 'destructive' &&
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        variant === 'outline' &&
          'border border-border bg-card/70 text-foreground hover:border-primary/45 hover:bg-primary/5 hover:text-primary',
        variant === 'secondary' &&
          'bg-secondary text-secondary-foreground shadow-sm hover:-translate-y-0.5 hover:bg-secondary/90',
        variant === 'ghost' && 'text-foreground hover:bg-muted hover:text-primary',
        variant === 'link' && 'rounded-none p-0 text-primary underline-offset-4 hover:underline',
        variant === 'danger' &&
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        variant === 'success' &&
          'bg-emerald-600 text-white shadow-sm hover:-translate-y-0.5 hover:bg-emerald-700',
        variant === 'auth' &&
          'bg-primary text-primary-foreground shadow-[0_16px_34px_-18px_hsl(var(--primary))] hover:-translate-y-0.5 hover:bg-primary/90 dark:border dark:border-border/80 dark:bg-muted dark:text-foreground dark:shadow-none dark:hover:bg-muted/80',
        size === 'default' && 'h-10 px-4 py-2',
        size === 'sm' && 'h-8 rounded-lg px-3 text-xs',
        size === 'lg' && 'h-12 px-6',
        size === 'icon' && 'h-10 w-10 p-0',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

export { Button };
