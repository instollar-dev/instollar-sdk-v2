import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children?: ReactNode;
}

export function Chip({ selected = false, className, children, type = 'button', ...props }: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-open-regular-label transition-colors',
        'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        selected
          ? 'border-primary bg-primary text-secondary'
          : 'border-border bg-background text-foreground hover:bg-primary/5',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
