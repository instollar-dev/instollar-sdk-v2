import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
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
 * Inline styles are intentional — Iconsax/`text-*` alone can fail under host CSS resets.
 */
const solidVariantStyles: Record<Exclude<ButtonVariant, 'ghost'>, CSSProperties> = {
  primary: {
    backgroundColor: 'var(--color-primary, #012b15)',
    color: 'var(--color-secondary, #effe3e)',
  },
  secondary: {
    backgroundColor: 'var(--color-secondary, #effe3e)',
    color: 'var(--color-primary, #012b15)',
  },
  destructive: {
    backgroundColor: 'var(--color-destructive, #b42318)',
    color: '#ffffff',
  },
  danger: {
    backgroundColor: 'var(--color-destructive, #b42318)',
    color: '#ffffff',
  },
};

const solidVariantClasses: Record<Exclude<ButtonVariant, 'ghost'>, string> = {
  primary: 'shadow-sm hover:opacity-90 [&_svg]:text-[var(--color-secondary,#effe3e)]',
  secondary: 'hover:opacity-90 [&_svg]:text-[var(--color-primary,#012b15)]',
  destructive: 'hover:opacity-90 [&_svg]:text-white',
  danger: 'hover:opacity-90 [&_svg]:text-white',
};

const ghostBaseClass =
  'bg-transparent border hover:bg-[color-mix(in_srgb,var(--color-primary,#012b15)_5%,transparent)] hover:cursor-pointer disabled:hover:cursor-not-allowed';

const ghostToneStyles: Record<ButtonTone, CSSProperties> = {
  default: {
    color: 'var(--color-fg, var(--color-primary, #012b15))',
    borderColor: 'var(--color-border, #d6ddd9)',
  },
  destructive: {
    color: 'var(--color-destructive, #b42318)',
    borderColor: 'color-mix(in srgb, var(--color-destructive, #b42318) 40%, transparent)',
  },
  danger: {
    color: 'var(--color-destructive, #b42318)',
    borderColor: 'color-mix(in srgb, var(--color-destructive, #b42318) 40%, transparent)',
  },
};

const ghostToneClasses: Record<ButtonTone, string> = {
  default: '[&_svg]:text-current',
  destructive:
    'hover:bg-[color-mix(in_srgb,var(--color-destructive,#b42318)_10%,transparent)] [&_svg]:text-[var(--color-destructive,#b42318)]',
  danger:
    'hover:bg-[color-mix(in_srgb,var(--color-destructive,#b42318)_10%,transparent)] [&_svg]:text-[var(--color-destructive,#b42318)]',
};

function getVariantClasses(variant: ButtonVariant, tone: ButtonTone): string {
  if (variant === 'ghost') {
    return `${ghostBaseClass} ${ghostToneClasses[tone]}`;
  }
  return solidVariantClasses[variant];
}

function getVariantStyle(variant: ButtonVariant, tone: ButtonTone): CSSProperties {
  if (variant === 'ghost') {
    return ghostToneStyles[tone];
  }
  return solidVariantStyles[variant];
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
  style,
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
      style={{ ...getVariantStyle(variant, tone), ...style }}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      <span
        aria-hidden={loading || undefined}
        className={cn('inline-flex items-center gap-2 text-inherit', loading && 'invisible')}
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
