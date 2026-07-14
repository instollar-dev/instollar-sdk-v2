import { cn } from '../utils/cn';

/**
 * Segmented control (iOS/Material-style pill group) — not underline tabs.
 * Adaptive accent: primary active in light, destructive active in dark.
 */
export type SegmentedTabsAccent = 'adaptive' | 'primary' | 'destructive';
export type SegmentedTabsSize = 'sm' | 'default';

/** Rounded-full track wrapping pill tabs. */
export const segmentedTabsTrackClasses =
  'inline-flex max-w-full min-w-0 flex-nowrap items-center gap-0.5 overflow-x-auto rounded-full border p-1 border-primary/25 bg-primary/5 dark:border-destructive/25 dark:bg-destructive/5';

/** Base pill tab — fully rounded, interactive. */
export const segmentedTabBaseClasses =
  'inline-flex shrink-0 items-center gap-1.5 rounded-full font-spline font-medium outline-none transition-all duration-150 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1';

export const segmentedTabSizeClasses: Record<SegmentedTabsSize, string> = {
  sm: 'px-2.5 py-1 text-open-regular-tiny',
  default: 'px-3 py-1.5 text-open-regular-label',
};

/** Count chip beside label — always tiny regardless of tab size. */
export const segmentedTabBadgeBaseClasses =
  'inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-open-bold-tiny leading-none tabular-nums';

const activeAdaptiveClasses =
  'bg-primary/15 text-primary shadow-sm dark:bg-destructive/15 dark:text-destructive [&_svg]:text-primary dark:[&_svg]:text-destructive';

const activePrimaryClasses = 'bg-primary/15 text-primary shadow-sm [&_svg]:text-primary';

const activeDestructiveClasses =
  'bg-destructive/15 text-destructive shadow-sm [&_svg]:text-destructive';

const inactiveAdaptiveClasses =
  'text-muted [&_svg]:text-muted hover:bg-primary/8 hover:text-primary hover:[&_svg]:text-primary dark:hover:bg-destructive/8 dark:hover:text-destructive dark:hover:[&_svg]:text-destructive';

const inactivePrimaryClasses =
  'text-muted [&_svg]:text-muted hover:bg-primary/8 hover:text-primary hover:[&_svg]:text-primary';

const inactiveDestructiveClasses =
  'text-muted [&_svg]:text-muted hover:bg-destructive/8 hover:text-destructive hover:[&_svg]:text-destructive';

export function getSegmentedTabStateClasses(
  selected: boolean,
  accent: SegmentedTabsAccent,
): string {
  if (selected) {
    if (accent === 'primary') return activePrimaryClasses;
    if (accent === 'destructive') return activeDestructiveClasses;
    return activeAdaptiveClasses;
  }
  if (accent === 'primary') return inactivePrimaryClasses;
  if (accent === 'destructive') return inactiveDestructiveClasses;
  return inactiveAdaptiveClasses;
}

export function getSegmentedTabBadgeClasses(
  selected: boolean,
  accent: SegmentedTabsAccent,
): string {
  if (!selected) {
    return cn(segmentedTabBadgeBaseClasses, 'bg-muted/15 text-muted');
  }
  if (accent === 'primary') {
    return cn(segmentedTabBadgeBaseClasses, 'bg-primary/20 text-primary');
  }
  if (accent === 'destructive') {
    return cn(segmentedTabBadgeBaseClasses, 'bg-destructive/20 text-destructive');
  }
  return cn(
    segmentedTabBadgeBaseClasses,
    'bg-primary/20 text-primary dark:bg-destructive/20 dark:text-destructive',
  );
}
