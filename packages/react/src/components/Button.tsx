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

/**
 * Hex fallbacks keep contrast even if CSS variables fail to resolve in the host app.
 * Primary = dark green fill + lime label; secondary = lime fill + dark green label.
 */
const solidVariantClasses: Record<Exclude<ButtonVariant, 'ghost'>, string> = {
  primary:
    'bg-[var(--color-primary,#012b15)] text-[var(--color-secondary,#effe3e)] shadow-sm hover:opacity-90 [&_svg]:text-[var(--color-secondary,#effe3e)]',
  secondary:
    'bg-[var(--color-secondary,#effe3e)] text-[var(--color-primary,#012b15)] hover:opacity-90 [&_svg]:text-[var(--color-primary,#012b15)]',
  destructive: 'bg-[var(--color-destructive,#b42318)] text-white hover:opacity-90 [&_svg]:text-white',
  danger: 'bg-[var(--color-destructive,#b42318)] text-white hover:opacity-90 [&_svg]:text-white',
};

const ghostBaseClass =
  'bg-transparent border hover:bg-[color-mix(in_srgb,var(--color-primary,#012b15)_5%,transparent)] hover:cursor-pointer disabled:hover:cursor-not-allowed';

const ghostToneClasses: Record<ButtonTone, string> = {
  default:
    'text-[var(--color-fg,var(--color-primary,#012b15))] border-[var(--color-border,#d6ddd9)] [&_svg]:text-current',
  destructive:
    'text-[var(--color-destructive,#b42318)] border-[color-mix(in_srgb,var(--color-destructive,#b42318)_40%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-destructive,#b42318)_10%,transparent)] [&_svg]:text-[var(--color-destructive,#b42318)]',
  danger:
    'text-[var(--color-destructive,#b42318)] border-[color-mix(in_srgb,var(--color-destructive,#b42318)_40%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-destructive,#b42318)_10%,transparent)] [&_svg]:text-[var(--color-destructive,#b42318)]',
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
