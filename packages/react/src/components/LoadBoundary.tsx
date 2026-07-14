import { Refresh, Shield, Warning2 } from 'iconsax-react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Button } from './Button';
import { Text } from './Text';

export interface LoadBoundaryProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** First load — no content to show yet */
  isLoading?: boolean;
  /** Request failed */
  isError?: boolean;
  /**
   * Error with prior content — show `children` and the stale banner (top-right).
   * With TanStack Query: `isError && data != null`, or `isError && isFetched`.
   */
  isStale?: boolean;
  /** User lacks permission — shows forbidden shell instead of children */
  permitted?: boolean;
  error?: Error | null;
  /** Loading shell copy */
  loadingMessage?: ReactNode;
  /** Error shell title when there is no stale content */
  errorTitle?: ReactNode;
  /** Error shell body — defaults to `error.message` */
  errorMessage?: ReactNode;
  /** Stale banner copy */
  staleMessage?: ReactNode;
  /** Forbidden shell title */
  forbiddenTitle?: ReactNode;
  forbiddenMessage?: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  refreshLabel?: string;
  /** Keeps loading/error shells the same footprint as your content area */
  minHeight?: string | number;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
  forbiddenFallback?: ReactNode;
}

function toMinHeightStyle(minHeight?: string | number): CSSProperties | undefined {
  if (minHeight === undefined) return undefined;
  return { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight };
}

function BoundaryLoader() {
  return (
    <div className="relative flex size-12 items-center justify-center" aria-hidden>
      <span className="absolute inset-0 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      <span className="absolute inset-2 animate-spin rounded-full border-2 border-primary/15 border-b-primary [animation-direction:reverse] [animation-duration:1.4s]" />
      <span className="size-2 animate-pulse rounded-full bg-primary/80" />
    </div>
  );
}

function Shell({
  className,
  style,
  children,
  tone = 'neutral',
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  tone?: 'neutral' | 'error' | 'forbidden';
}) {
  const toneClasses = {
    neutral: 'border-border/70 bg-background',
    error: 'border-destructive/25 bg-destructive/10',
    forbidden: 'border-border/70 bg-background',
  } as const;

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-4 rounded-2xl border px-6 py-10 text-center',
        'animate-[load-boundary-enter_320ms_ease-out_both]',
        toneClasses[tone],
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

function StaleBanner({
  message,
  refreshLabel,
  onRetry,
}: {
  message: ReactNode;
  refreshLabel: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className={cn(
        'pointer-events-auto absolute right-3 top-3 z-10 flex max-w-[min(100%,20rem)] items-center gap-2',
        'rounded-full border border-secondary/50 bg-background/95 px-3 py-1.5 shadow-sm backdrop-blur-sm',
        'animate-[load-boundary-enter_280ms_ease-out_both]',
      )}
      role="status"
      aria-live="polite"
    >
      <span className="relative flex size-2 shrink-0" aria-hidden>
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary/50" />
        <span className="relative inline-flex size-2 rounded-full bg-secondary" />
      </span>
      <Text variant="open-regular-tiny" className="min-w-0 text-left text-foreground/85">
        {message}
      </Text>
      {onRetry ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0 px-2"
          prefix={<Refresh size={14} aria-hidden />}
          onClick={onRetry}
        >
          {refreshLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function LoadBoundary({
  children,
  className,
  style,
  isLoading = false,
  isError = false,
  isStale = false,
  permitted = true,
  error,
  loadingMessage = 'Loading…',
  errorTitle = 'Something went wrong',
  errorMessage,
  staleMessage = 'Showing cached data — may not be up to date',
  forbiddenTitle = 'Access restricted',
  forbiddenMessage = "You don't have permission to view this section.",
  onRetry,
  retryLabel = 'Try again',
  refreshLabel = 'Refresh',
  minHeight,
  loadingFallback,
  errorFallback,
  forbiddenFallback,
}: LoadBoundaryProps) {
  const shellStyle = toMinHeightStyle(minHeight);
  const resolvedErrorMessage = errorMessage ?? error?.message ?? 'Please try again.';
  const [staleBannerDismissed, setStaleBannerDismissed] = useState(false);

  useEffect(() => {
    if (!isStale) {
      setStaleBannerDismissed(false);
    }
  }, [isStale]);

  const handleStaleRetry = () => {
    onRetry?.();
    setStaleBannerDismissed(true);
  };

  const showStaleBanner = isStale && !staleBannerDismissed;

  if (!permitted) {
    if (forbiddenFallback) {
      return (
        <div className={cn('relative w-full', className)} style={{ ...shellStyle, ...style }}>
          {forbiddenFallback}
        </div>
      );
    }

    return (
      <div className={cn('relative w-full', className)} style={{ ...shellStyle, ...style }}>
        <Shell tone="forbidden" style={shellStyle}>
          <div className="flex size-12 items-center justify-center rounded-full bg-foreground/5 text-muted">
            <Shield size={24} variant="Bold" aria-hidden />
          </div>
          <div className="space-y-1">
            <Text variant="spline-bold-h5">{forbiddenTitle}</Text>
            <Text variant="open-regular-p" className="text-muted">
              {forbiddenMessage}
            </Text>
          </div>
        </Shell>
      </div>
    );
  }

  if (isLoading && !isStale) {
    if (loadingFallback) {
      return (
        <div className={cn('relative w-full', className)} style={{ ...shellStyle, ...style }}>
          {loadingFallback}
        </div>
      );
    }

    return (
      <div
        className={cn('relative w-full', className)}
        style={{ ...shellStyle, ...style }}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Shell style={shellStyle}>
          <BoundaryLoader />
          <Text variant="open-regular-p" className="text-muted">
            {loadingMessage}
          </Text>
        </Shell>
      </div>
    );
  }

  if (isError && !isStale) {
    if (errorFallback) {
      return (
        <div className={cn('relative w-full', className)} style={{ ...shellStyle, ...style }}>
          {errorFallback}
        </div>
      );
    }

    return (
      <div className={cn('relative w-full', className)} style={{ ...shellStyle, ...style }}>
        <Shell tone="error" style={shellStyle}>
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Warning2 size={24} variant="Bold" aria-hidden />
          </div>
          <div className="space-y-1">
            <Text variant="spline-bold-h5">{errorTitle}</Text>
            <Text variant="open-regular-p" className="text-muted">
              {resolvedErrorMessage}
            </Text>
          </div>
          {onRetry ? (
            <Button
              type="button"
              variant="ghost"
              prefix={<Refresh size={16} aria-hidden />}
              onClick={onRetry}
            >
              {retryLabel}
            </Button>
          ) : null}
        </Shell>
      </div>
    );
  }

  return (
    <div
      className={cn('relative w-full', className)}
      style={style}
      data-stale={showStaleBanner || undefined}
    >
      {showStaleBanner ? (
        <StaleBanner message={staleMessage} refreshLabel={refreshLabel} onRetry={handleStaleRetry} />
      ) : null}
      <div
        className={cn(
          'transition-opacity duration-300 ease-out',
          showStaleBanner && 'opacity-95',
          'animate-[load-boundary-enter_320ms_ease-out_both]',
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Map TanStack Query result flags to `LoadBoundary` props. */
export function loadBoundaryPropsFromQuery(query: {
  isPending: boolean;
  isError: boolean;
  data: unknown;
  error?: Error | null;
  refetch: () => unknown;
}) {
  return {
    isLoading: query.isPending && query.data == null,
    isError: query.isError,
    isStale: query.isError && query.data != null,
    error: query.error ?? null,
    onRetry: () => {
      void query.refetch();
    },
  } as const;
}
