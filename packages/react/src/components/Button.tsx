import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'default' | 'sm';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-secondary hover:opacity-90',
  secondary: 'bg-secondary text-primary hover:opacity-90',
  ghost: 'bg-transparent border border-border text-foreground hover:bg-primary/5',
  destructive: 'bg-destructive text-white hover:opacity-90',
};

const sizeClasses: Record<ButtonSize, string> = {
  default: 'px-4 py-2 text-spline-bold-label',
  sm: 'px-3 py-1.5 text-open-regular-tiny',
};

const spinnerSize: Record<ButtonSize, number> = {
  default: 16,
  sm: 14,
};

const affixClass = 'inline-flex shrink-0 items-center text-inherit [&_svg]:text-inherit';

export function Button({
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled,
  prefix,
  suffix,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-md font-spline outline-none',
        'cursor-pointer transition-opacity disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      <span
        aria-hidden={loading || undefined}
        className={cn('inline-flex items-center gap-2', loading && 'invisible')}
      >
        {prefix ? <span className={affixClass}>{prefix}</span> : null}
        {children}
        {suffix ? <span className={affixClass}>{suffix}</span> : null}
      </span>
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner size={spinnerSize[size]} />
        </span>
      ) : null}
    </button>
  );
}
