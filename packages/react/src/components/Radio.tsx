import { useId, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function Radio({ label, className, id, disabled, ...props }: RadioProps) {
  const generatedId = useId();
  const radioId = id ?? generatedId;

  return (
    <label
      htmlFor={radioId}
      className={cn(
        'inline-flex items-center gap-2 text-open-regular-p text-foreground',
        disabled && 'cursor-not-allowed opacity-50',
        !disabled && 'cursor-pointer',
      )}
    >
      <input
        id={radioId}
        type="radio"
        disabled={disabled}
        className={cn(
          'size-4 border-border text-primary accent-primary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          className,
        )}
        {...props}
      />
      {label}
    </label>
  );
}
