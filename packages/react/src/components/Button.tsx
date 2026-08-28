import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Spinner } from './Spinner';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'underline'
  | 'destructive'
  | 'danger';
export type ButtonTone = 'default' | 'destructive' | 'danger';
export type ButtonSize = 'default' | 'sm';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> {
  variant?: ButtonVariant;
  /** Ghost / underline — tints label, prefix, and suffix with destructive/danger colors */
  tone?: ButtonTone;
  size?: ButtonSize;
  loading?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

type SolidVariant = Exclude<ButtonVariant, 'ghost' | 'underline'>;

/**
 * Hex fallbacks keep contrast even if CSS variables fail to resolve in the host app.
 * Primary fill uses `--color-brand` (stable forest green) so dark mode can lift
 * `--color-primary` for text/accents without washing out solid buttons.
 * Secondary = lime fill + brand label.
 * Inline styles are intentional — Iconsax/`text-*` alone can fail under host CSS resets.
 */
const solidVariantStyles: Record<SolidVariant, CSSProperties> = {
  primary: {
    backgroundColor: 'var(--color-brand, #012b15)',
    color: '#ffffff',
  },
  secondary: {
    backgroundColor: 'var(--color-secondary, #f49e0c)',
    color: 'var(--color-brand, #012b15)',
  },
  destructive: {
    backgroundColor: 'var(--color-destructive, #f49e0c)',
    color: '#ffffff',
  },
  danger: {
    backgroundColor: 'var(--color-danger, #dc2626)',
    color: '#ffffff',
  },
};

const solidVariantClasses: Record<SolidVariant, string> = {
  primary: 'shadow-sm hover:opacity-90 [&_svg]:text-white',
  secondary: 'hover:opacity-90 [&_svg]:text-[var(--color-brand,#012b15)]',
  destructive: 'hover:opacity-90 [&_svg]:text-white',
  danger: 'hover:opacity-90 [&_svg]:text-white',
};

const softBaseClasses = {
  ghost:
    'bg-transparent border hover:bg-[color-mix(in_srgb,var(--color-brand,#012b15)_5%,transparent)] hover:cursor-pointer disabled:hover:cursor-not-allowed',
  underline:
    'bg-transparent border-0 underline underline-offset-4 decoration-from-font rounded-none px-0 hover:opacity-80 hover:cursor-pointer disabled:hover:cursor-not-allowed [&_svg]:text-current',
} as const;

const softToneStyles: Record<ButtonTone, CSSProperties> = {
  default: {
    color: 'var(--color-soft-button, var(--color-fg, var(--color-brand, #012b15)))',
    borderColor: 'var(--color-soft-button-border, var(--color-border, #d6ddd9))',
  },
  destructive: {
    color: 'var(--color-destructive, #f49e0c)',
    borderColor: 'color-mix(in srgb, var(--color-destructive, #f49e0c) 45%, transparent)',
  },
  danger: {
    color: 'var(--color-danger, #dc2626)',
    borderColor: 'color-mix(in srgb, var(--color-danger, #dc2626) 40%, transparent)',
  },
};

const softToneClasses: Record<ButtonTone, string> = {
  default: '[&_svg]:text-current',
  destructive:
    'hover:bg-[color-mix(in_srgb,var(--color-destructive,#f49e0c)_12%,transparent)] [&_svg]:text-[var(--color-destructive,#f49e0c)]',
  danger:
    'hover:bg-[color-mix(in_srgb,var(--color-danger,#dc2626)_10%,transparent)] [&_svg]:text-[var(--color-danger,#dc2626)]',
};

function getVariantClasses(variant: ButtonVariant, tone: ButtonTone): string {
  if (variant === 'underline') {
    return softBaseClasses.underline;
  }
  if (variant === 'ghost') {
    return `${softBaseClasses.ghost} ${softToneClasses[tone]}`;
  }
  return solidVariantClasses[variant];
}

function getVariantStyle(variant: ButtonVariant, tone: ButtonTone): CSSProperties {
  if (variant === 'underline') {
    return { color: softToneStyles[tone].color };
  }
  if (variant === 'ghost') {
    return softToneStyles[tone];
  }
  return solidVariantStyles[variant];
}

const sizeClasses: Record<ButtonSize, string> = {
  default: 'px-4 py-2 text-spline-regular-label font-normal',
  sm: 'px-3 py-1.5 text-open-regular-tiny font-normal',
};

/** Underline is text-like — keep vertical rhythm but drop horizontal padding from size. */
const underlineSizeClasses: Record<ButtonSize, string> = {
  default: 'py-2 text-spline-regular-label font-normal',
  sm: 'py-1.5 text-open-regular-tiny font-normal',
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
        variant === 'underline' ? underlineSizeClasses[size] : sizeClasses[size],
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
