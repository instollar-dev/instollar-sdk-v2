import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

export type TextVariant =
  | 'spline-bold-display'
  | 'spline-bold-h4'
  | 'spline-bold-h5'
  | 'spline-bold-label'
  | 'spline-regular-p'
  | 'open-bold-h5'
  | 'open-bold-p'
  | 'open-regular-p'
  | 'open-regular-label'
  | 'open-regular-tiny';

const variantClasses: Record<TextVariant, string> = {
  'spline-bold-display': 'text-spline-bold-display',
  'spline-bold-h4': 'text-spline-bold-h4',
  'spline-bold-h5': 'text-spline-bold-h5',
  'spline-bold-label': 'text-spline-bold-label',
  'spline-regular-p': 'text-spline-regular-p',
  'open-bold-h5': 'text-open-bold-h5',
  'open-bold-p': 'text-open-bold-p',
  'open-regular-p': 'text-open-regular-p',
  'open-regular-label': 'text-open-regular-label',
  'open-regular-tiny': 'text-open-regular-tiny',
};

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  as?: ElementType;
  children?: ReactNode;
}

export function Text({
  variant = 'open-regular-p',
  as: Comp = 'p',
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Comp className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </Comp>
  );
}
