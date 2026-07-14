import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export function Input({
  label,
  error,
  prefix,
  suffix,
  className,
  id,
  disabled,
  ...props
}: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label htmlFor={inputId} className="text-open-regular-label text-foreground">
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          'flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2',
          'focus-within:border-primary',
          error && 'border-destructive',
          disabled && 'opacity-50',
        )}
      >
        {prefix ? <span className="inline-flex shrink-0 text-muted">{prefix}</span> : null}
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          className={cn(
            'w-full min-w-0 flex-1 bg-transparent text-open-regular-p text-foreground outline-none',
            'placeholder:text-muted disabled:cursor-not-allowed',
            className,
          )}
          {...props}
        />
        {suffix ? <span className="inline-flex shrink-0 text-muted">{suffix}</span> : null}
      </div>
      {error ? (
        <p id={inputId ? `${inputId}-error` : undefined} className="text-open-regular-tiny text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
