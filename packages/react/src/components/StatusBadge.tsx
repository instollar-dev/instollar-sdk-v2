import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import {
  statusBadgeBaseClasses,
  statusBadgeToneClasses,
  type StatusTone,
} from './statusBadgeVariants';

export type { StatusTone };

export interface StatusBadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'prefix'> {
  tone: StatusTone;
  label: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export function StatusBadge({
  tone,
  label,
  prefix,
  suffix,
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeBaseClasses, statusBadgeToneClasses[tone], className)}
      {...props}
    >
      {prefix}
      {label}
      {suffix}
    </span>
  );
}
