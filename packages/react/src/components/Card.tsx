import type { HTMLAttributes } from 'react';
import { useThemeOptional } from '../theme/ThemeProvider';
import { cn } from '../utils/cn';

export type CardVariant = 'light' | 'dark-glass';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  light: 'bg-white border border-border rounded-2xl p-5 shadow-sm',
  'dark-glass': 'bg-primary/35 border border-white/14 rounded-lg p-4 text-white',
};

export function Card({ variant, className, children, ...props }: CardProps) {
  const theme = useThemeOptional();
  const resolvedVariant = variant ?? (theme?.resolvedTheme === 'dark' ? 'dark-glass' : 'light');

  return (
    <div className={cn(variantClasses[resolvedVariant], className)} {...props}>
      {children}
    </div>
  );
}
