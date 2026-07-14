import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'danger';
export type ButtonTone = 'default' | 'destructive' | 'danger';
export type ButtonSize = 'default' | 'sm';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> {
  variant?: ButtonVariant;
  /** Ghost only — tints label, prefix, and suffix with destructive/danger colors */
  tone?: ButtonTone;
  size?: ButtonSize;
  loading?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

const solidVariantClasses: Record<Exclude<ButtonVariant, 'ghost'>, string> = {
  primary: 'bg-primary text-secondary shadow-sm hover:opacity-90 [&_svg]:text-secondary',
  secondary: 'bg-secondary text-primary hover:opacity-90 [&_svg]:text-primary',
  destructive: 'bg-destructive text-white hover:opacity-90 [&_svg]:text-white',
  danger: 'bg-destructive text-white hover:opacity-90 [&_svg]:text-white',
};

const ghostBaseClass =
  'bg-transparent border hover:bg-primary/5 hover:cursor-pointer disabled:hover:cursor-not-allowed dark:hover:bg-white/6';

const ghostToneClasses: Record<ButtonTone, string> = {
  default: 'text-foreground border-border dark:text-white/72 dark:border-white/14 [&_svg]:text-current',
  destructive:
    'text-destructive border-destructive/40 hover:bg-destructive/10 [&_svg]:text-destructive',
  danger: 'text-destructive border-destructive/40 hover:bg-destructive/10 [&_svg]:text-destructive',
};

function getVariantClasses(variant: ButtonVariant, tone: ButtonTone): string {
  if (variant === 'ghost') {
    return `${ghostBaseClass} ${ghostToneClasses[tone]}`;
  }
  return solidVariantClasses[variant];
}

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
  tone = 'default',
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
        getVariantClasses(variant, tone),
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
