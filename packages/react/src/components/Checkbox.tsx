import { TickCircle } from 'iconsax-react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import type { FieldSurface } from './formVariants';
import {
  formFieldDescriptionClass,
  formFieldErrorClass,
  formFieldLabelClass,
} from './formVariants';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  description?: string;
  error?: string;
  variant?: FieldSurface;
}

export function Checkbox({
  label,
  description,
  error,
  variant,
  className,
  id,
  disabled,
  ...props
}: CheckboxProps) {
  const resolvedVariant = variant ?? 'light';
  const inputId =
    id ?? (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={inputId}
        className={cn(
          'group inline-flex items-start gap-2.5',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          className,
        )}
      >
        <span className="relative mt-0.5 shrink-0">
          <input
            type="checkbox"
            id={inputId}
            disabled={disabled}
            className="peer sr-only"
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error && inputId
                ? `${inputId}-error`
                : description && inputId
                  ? `${inputId}-desc`
                  : undefined
            }
            {...props}
          />
          <span
            className={cn(
              'flex size-4 items-center justify-center rounded border-2 transition-colors duration-150 outline-none',
              'peer-checked:border-primary peer-checked:bg-primary',
              '[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100',
              'peer-disabled:opacity-50',
              resolvedVariant === 'light'
                ? 'border-border bg-white'
                : 'border-white/14 bg-primary/35',
              error && 'border-destructive',
            )}
          >
            <TickCircle size={12} variant="Bold" className="text-secondary" aria-hidden />
          </span>
        </span>
        {(label || description) && (
          <span className="flex min-w-0 flex-col gap-0.5">
            {label ? <span className={cn(formFieldLabelClass, 'font-medium')}>{label}</span> : null}
            {description ? (
              <span id={inputId ? `${inputId}-desc` : undefined} className={formFieldDescriptionClass}>
                {description}
              </span>
            ) : null}
          </span>
        )}
      </label>
      {error ? (
        <p id={inputId ? `${inputId}-error` : undefined} role="alert" className={formFieldErrorClass}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
