import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, disabled, ...props }: TextareaProps) {
  const textareaId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label htmlFor={textareaId} className="text-open-regular-label text-foreground">
          {label}
        </label>
      ) : null}
      <textarea
        id={textareaId}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error && textareaId ? `${textareaId}-error` : undefined}
        className={cn(
          'min-h-24 w-full rounded-md border border-border bg-background px-3 py-2',
          'text-open-regular-p text-foreground outline-none placeholder:text-muted',
          'focus:border-primary disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive',
          className,
        )}
        {...props}
      />
      {error ? (
        <p
          id={textareaId ? `${textareaId}-error` : undefined}
          className="text-open-regular-tiny text-destructive"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
