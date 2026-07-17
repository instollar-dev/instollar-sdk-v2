import type { ReactNode, TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { FieldControl } from './FieldControl';
import { formFieldErrorClass, formFieldLabelClass } from './formVariants';

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'prefix'> {
  label?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export function Textarea({
  label,
  error,
  prefix,
  suffix,
  className,
  id,
  disabled,
  ...props
}: TextareaProps) {
  const textareaId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1">
      {label && textareaId ? (
        <label htmlFor={textareaId} className={formFieldLabelClass}>
          {label}
        </label>
      ) : null}
      <FieldControl
        error={!!error}
        disabled={disabled}
        prefix={prefix}
        suffix={suffix}
        className="items-stretch"
      >
        <textarea
          id={textareaId}
          disabled={disabled}
          className={cn(
            'min-h-[80px] w-full resize-y border-0 bg-transparent px-3 py-2 text-open-regular-p outline-none placeholder:text-muted',
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && textareaId ? `${textareaId}-error` : undefined}
          {...props}
        />
      </FieldControl>
      {error ? (
        <p
          id={textareaId ? `${textareaId}-error` : undefined}
          role="alert"
          className={formFieldErrorClass}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
