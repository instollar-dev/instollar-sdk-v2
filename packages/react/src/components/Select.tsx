import type { SelectHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  options,
  placeholder,
  className,
  id,
  disabled,
  ...props
}: SelectProps) {
  const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label htmlFor={selectId} className="text-open-regular-label text-foreground">
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error && selectId ? `${selectId}-error` : undefined}
        className={cn(
          'w-full rounded-md border border-border bg-background px-3 py-2',
          'text-open-regular-p text-foreground outline-none',
          'focus:border-primary disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive',
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p
          id={selectId ? `${selectId}-error` : undefined}
          className="text-open-regular-tiny text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
