import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { useThemeOptional } from '../theme/ThemeProvider';
import { cn } from '../utils/cn';
import type { FieldSurface } from './formVariants';
import {
  formFieldDescriptionClass,
  formFieldErrorClass,
  formFieldLabelClass,
} from './formVariants';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: string;
  error?: string;
  variant?: FieldSurface;
}

export function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  label,
  description,
  error,
  variant,
  className,
  id,
  disabled,
  onClick,
  ...props
}: SwitchProps) {
  const theme = useThemeOptional();
  const resolvedVariant = variant ?? (theme?.resolvedTheme === 'dark' ? 'dark' : 'light');
  const switchId =
    id ?? (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const isChecked = checked ?? internalChecked;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    const next = !isChecked;
    if (checked === undefined) {
      setInternalChecked(next);
    }
    onCheckedChange?.(next);
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="inline-flex items-start gap-2.5">
        <button
          type="button"
          role="switch"
          id={switchId}
          aria-checked={isChecked}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error && switchId
              ? `${switchId}-error`
              : description && switchId
                ? `${switchId}-desc`
                : undefined
          }
          disabled={disabled}
          onClick={handleClick}
          className={cn(
            'relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 transition-colors duration-200 outline-none',
            'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
            isChecked
              ? 'border-primary bg-primary'
              : resolvedVariant === 'light'
                ? 'border-border bg-[rgba(1,43,21,0.12)]'
                : 'border-white/14 bg-primary/35',
            error && 'border-destructive',
          )}
          {...props}
        >
          <span
            className={cn(
              'pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-200',
              isChecked ? 'translate-x-4' : 'translate-x-0.5',
            )}
          />
        </button>
        {(label || description) && (
          <label
            htmlFor={switchId}
            className={cn(
              'flex min-w-0 flex-col gap-0.5',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            )}
          >
            {label ? <span className={cn(formFieldLabelClass, 'font-medium')}>{label}</span> : null}
            {description ? (
              <span
                id={switchId ? `${switchId}-desc` : undefined}
                className={formFieldDescriptionClass}
              >
                {description}
              </span>
            ) : null}
          </label>
        )}
      </div>
      {error ? (
        <p
          id={switchId ? `${switchId}-error` : undefined}
          role="alert"
          className={formFieldErrorClass}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
