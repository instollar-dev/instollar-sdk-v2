import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'error';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children?: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-primary text-secondary',
  secondary: 'bg-secondary text-primary',
  success: 'bg-primary/15 text-primary',
  warning: 'bg-secondary/50 text-foreground',
  error: 'bg-destructive/15 text-destructive',
};

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-open-bold-tiny',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
