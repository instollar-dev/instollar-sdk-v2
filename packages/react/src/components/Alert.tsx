import { CloseCircle, InfoCircle, TickCircle, Warning2 } from 'iconsax-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import {
  alertContainerClasses,
  alertIconChipClasses,
  toastContainerClasses,
  type AlertVariant,
} from './alertVariants';

export type { AlertVariant };

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant;
  /** `inline` = soft tint (forms). `toast` = opaque card surface (overlays). */
  appearance?: 'inline' | 'toast';
  title?: ReactNode;
  /** Show a dismiss button */
  onDismiss?: () => void;
}

const iconMap = {
  success: TickCircle,
  error: Warning2,
  destructive: Warning2,
  warning: Warning2,
  info: InfoCircle,
} as const;

export function Alert({
  variant = 'info',
  appearance = 'inline',
  title,
  onDismiss,
  className,
  children,
  ...props
}: AlertProps) {
  const Icon = iconMap[variant];
  const containerClasses =
    appearance === 'toast' ? toastContainerClasses[variant] : alertContainerClasses[variant];

  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 rounded-xl border-l-2 py-3 pl-3.5 pr-3 text-open-regular-p',
        containerClasses,
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full',
          alertIconChipClasses[variant],
        )}
      >
        <Icon size={13} variant="Bold" aria-hidden />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        {title ? (
          <p className="mb-0.5 text-spline-bold-label leading-snug text-foreground">{title}</p>
        ) : null}
        {children ? (
          <div className={cn('leading-relaxed', title ? 'text-muted' : 'text-foreground')}>
            {children}
          </div>
        ) : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex h-fit shrink-0 cursor-pointer self-start rounded-md p-1 text-muted/70 transition-colors hover:cursor-pointer hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
          aria-label="Dismiss alert"
        >
          <CloseCircle size={14} variant="Linear" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
