import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-background p-4 text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
