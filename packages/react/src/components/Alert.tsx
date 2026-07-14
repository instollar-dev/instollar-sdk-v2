import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  children?: ReactNode;
}

const variantClasses: Record<AlertVariant, string> = {
  info: 'border-primary/20 bg-primary/5 text-foreground',
  success: 'border-primary/30 bg-primary/10 text-primary',
  warning: 'border-secondary bg-secondary/30 text-foreground',
  error: 'border-destructive/30 bg-destructive/10 text-destructive',
};

export function Alert({
  variant = 'info',
  title,
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-md border px-4 py-3 text-open-regular-p',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {title ? <p className="mb-1 text-spline-bold-label">{title}</p> : null}
      {children}
    </div>
  );
}
