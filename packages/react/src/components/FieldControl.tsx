import { forwardRef, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { formControlSurfaceClass } from './formVariants';

export interface FieldControlProps {
  prefix?: ReactNode;
  suffix?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export const FieldControl = forwardRef<HTMLDivElement, FieldControlProps>(function FieldControl(
  { prefix, suffix, error, disabled, className, children },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'flex min-h-11 w-full items-center rounded-lg border transition-colors duration-200',
        formControlSurfaceClass,
        error && 'border-destructive',
        disabled && 'opacity-50',
        className,
      )}
    >
      {prefix ? (
        <div className="flex shrink-0 items-center pl-3 text-muted [&>svg]:size-4">{prefix}</div>
      ) : null}
      <div className="min-w-0 flex-1">{children}</div>
      {suffix ? (
        <div className="flex shrink-0 items-center pr-3 text-muted [&>svg]:size-4">{suffix}</div>
      ) : null}
    </div>
  );
});
