import { useEffect, useState, type FC, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export type AlertVariant = 'error' | 'success' | 'pending' | 'info';

export interface AlertProps {
  children?: ReactNode;
  variant?: AlertVariant;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export type AlertTextProps = AlertProps;

export type DismissibleAlertProps = Pick<
  AlertProps,
  'dismissible' | 'onDismiss' | 'children'
>;

export function dismissibleAlertProps(
  message: ReactNode,
  onClear: () => void,
): DismissibleAlertProps {
  const isEmpty =
    message == null ||
    message === '' ||
    (typeof message === 'boolean' && !message);
  if (isEmpty) return { children: message, dismissible: false };
  return { children: message, dismissible: true, onDismiss: onClear };
}

const variantClasses: Record<AlertVariant, string> = {
  error:
    'text-[var(--sdk-alert-text-error-text,var(--color-destructive))] bg-[var(--sdk-alert-text-error-bg,color-mix(in_srgb,var(--color-destructive)_12%,var(--color-bg)))] border-l-[var(--sdk-alert-text-error-border,var(--color-destructive))]',
  success:
    'text-[var(--sdk-alert-text-success-text,var(--color-primary))] bg-[var(--sdk-alert-text-success-bg,color-mix(in_srgb,var(--color-primary)_12%,var(--color-bg)))] border-l-[var(--sdk-alert-text-success-border,var(--color-primary))]',
  pending:
    'text-[var(--sdk-alert-text-pending-text,var(--color-fg))] bg-[var(--sdk-alert-text-pending-bg,color-mix(in_srgb,var(--color-secondary)_28%,var(--color-bg)))] border-l-[var(--sdk-alert-text-pending-border,var(--color-secondary))]',
  info:
    'text-[var(--sdk-alert-text-info-text,var(--color-primary))] bg-[var(--sdk-alert-text-info-bg,color-mix(in_srgb,var(--color-primary)_10%,var(--color-bg)))] border-l-[var(--sdk-alert-text-info-border,var(--color-primary))]',
};

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export const AlertText: FC<AlertProps> = ({
  children,
  variant = 'error',
  className,
  dismissible = false,
  onDismiss,
}) => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
  }, [children]);

  if (dismissed || children == null || children === '' || children === false) return null;

  return (
    <div
      className={cn(
        'border-l-4 px-4 py-2 text-sm',
        dismissible && 'flex items-start gap-3',
        variantClasses[variant],
        className,
      )}
      role="alert"
      aria-live="polite"
    >
      <div className={cn(dismissible && 'min-w-0 flex-1')}>{children}</div>
      {dismissible ? (
        <button
          type="button"
          onClick={() => {
            onDismiss?.();
            setDismissed(true);
          }}
          className="shrink-0 rounded p-0.5 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
          aria-label="Dismiss"
        >
          <CloseIcon />
        </button>
      ) : null}
    </div>
  );
};

export default AlertText;
