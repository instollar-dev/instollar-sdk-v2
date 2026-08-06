import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export type ProgressBarSize = 'sm' | 'md';

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Current progress (0–`max`). */
  value: number;
  /** Maximum value. Default: `100`. */
  max?: number;
  /** Accessible label when no visible `label` is set. */
  'aria-label'?: string;
  /** Visible label above the bar. Omit for a bare track. */
  label?: string;
  /** Show numeric percentage to the right of the label. */
  showValue?: boolean;
  size?: ProgressBarSize;
}

const sizeClasses: Record<ProgressBarSize, string> = {
  sm: 'h-1.5',
  md: 'h-2',
};

function clampProgress(value: number, max: number): number {
  if (!Number.isFinite(value) || max <= 0) return 0;
  return Math.min(max, Math.max(0, value));
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  className,
  'aria-label': ariaLabel,
  ...props
}: ProgressBarProps) {
  const clamped = clampProgress(value, max);
  const percent = max > 0 ? Math.round((clamped / max) * 100) : 0;
  const hasChrome = Boolean(label || showValue);

  const track = (
    <div
      role="progressbar"
      aria-label={ariaLabel ?? label ?? 'Progress'}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped}
      className={cn(
        'w-full overflow-hidden rounded-full bg-border',
        sizeClasses[size],
        !hasChrome && className,
      )}
      {...(!hasChrome ? props : {})}
    >
      <div
        className="h-full rounded-full bg-destructive transition-[width] duration-200 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  );

  if (!hasChrome) return track;

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)} {...props}>
      <div className="flex items-center justify-between gap-2 text-open-regular-label text-foreground">
        {label ? <span>{label}</span> : <span />}
        {showValue ? <span className="tabular-nums text-muted">{percent}%</span> : null}
      </div>
      {track}
    </div>
  );
}
