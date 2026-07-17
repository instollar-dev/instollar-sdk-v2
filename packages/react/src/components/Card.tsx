import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type CardVariant = 'light';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const cardSurfaceClass = 'bg-background border border-border rounded-2xl p-5 shadow-sm';

export function Card({ variant: _variant, className, children, ...props }: CardProps) {
  return (
    <div className={cn(cardSurfaceClass, className)} {...props}>
      {children}
    </div>
  );
}
