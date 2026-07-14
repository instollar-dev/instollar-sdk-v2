import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> {
  selected?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export function Chip({
  selected = false,
  prefix,
  suffix,
  className,
  children,
  type = 'button',
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-open-regular-label outline-none transition-all duration-150',
        'cursor-pointer hover:cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:cursor-not-allowed',
        selected
          ? 'border-primary bg-primary/18 text-foreground'
          : 'border-border bg-transparent text-foreground hover:border-primary/45',
        className,
      )}
      {...props}
    >
      {prefix}
      {children}
      {suffix}
    </button>
  );
}
