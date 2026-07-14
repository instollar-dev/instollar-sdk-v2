import { cn } from '../utils/cn';

export interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 16, className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent',
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
