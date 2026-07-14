import { useId, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export function Checkbox({ label, error, className, id, disabled, ...props }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={checkboxId}
        className={cn(
          'inline-flex items-center gap-2 text-open-regular-p text-foreground',
          disabled && 'cursor-not-allowed opacity-50',
          !disabled && 'cursor-pointer',
        )}
      >
        <input
          id={checkboxId}
          type="checkbox"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          className={cn(
            'size-4 rounded border-border text-primary accent-primary',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            className,
          )}
          {...props}
        />
        {label}
      </label>
      {error ? <p className="text-open-regular-tiny text-destructive">{error}</p> : null}
    </div>
  );
}
