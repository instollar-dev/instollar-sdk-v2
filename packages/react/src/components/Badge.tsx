import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type BadgeVariant =
  | 'kicker'
  | 'eyebrow'
  | 'success'
  | 'destructive'
  | 'neutral'
  | 'secondary';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'prefix'> {
  variant?: BadgeVariant;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  kicker:
    'text-open-bold-tiny px-3 py-1 rounded-full border border-primary/45 bg-primary/14 text-primary',
  eyebrow:
    'text-open-bold-tiny font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-primary/45',
  success: 'text-open-bold-tiny px-2 py-0.5 rounded-full bg-primary/14 text-primary',
  destructive: 'text-open-bold-tiny px-2 py-0.5 rounded-full bg-destructive/12 text-destructive',
  neutral: 'text-open-bold-tiny px-2 py-0.5 rounded-full bg-muted/15 text-muted capitalize',
  secondary: 'text-open-bold-tiny px-2.5 py-0.5 rounded-full bg-secondary text-primary',
};

export function Badge({
  variant = 'kicker',
  prefix,
  suffix,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5', variantClasses[variant], className)}
      {...props}
    >
      {prefix}
      {children}
      {suffix}
    </span>
  );
}
