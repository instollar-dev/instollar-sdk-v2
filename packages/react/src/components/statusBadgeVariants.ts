/**
 * Legacy tones kept for source compatibility with the previous StatusBadge API.
 * @deprecated Use {@link StatusVariant} instead.
 */
export type StatusTone = 'success' | 'destructive' | 'neutral';

/** @deprecated Legacy base classes for the old tone-based StatusBadge. */
export const statusBadgeBaseClasses =
  'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-open-bold-tiny font-semibold capitalize';

/** @deprecated Legacy tone classes for the old tone-based StatusBadge. */
export const statusBadgeToneClasses: Record<StatusTone, string> = {
  success: 'bg-primary/14 text-primary',
  destructive: 'bg-destructive/12 text-destructive',
  neutral: 'bg-muted/15 text-muted',
};

/** Semantic visual variants. Palettes are themeable via `--sdk-status-*` CSS variables. */
export type StatusVariant =
  | 'success'
  | 'successTint'
  | 'info'
  | 'progress'
  | 'warning'
  | 'warningAmber'
  | 'danger'
  | 'dangerBordered'
  | 'dangerStrong'
  | 'dangerTint'
  | 'review'
  | 'muted'
  | 'neutral';

export type StatusBadgeSize = 'sm' | 'md' | 'lg';

export const statusBadgeVariantBaseClasses =
  'inline-flex items-center justify-center rounded-md font-medium w-fit transition-all duration-200 whitespace-nowrap';

export const statusBadgeSizeClasses: Record<StatusBadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-2',
  lg: 'px-3 py-1.5 text-sm gap-2.5',
};

export const statusBadgeVariantClasses: Record<StatusVariant, string> = {
  success:
    'bg-[var(--sdk-status-success-bg,#E8FDF0)] text-[var(--sdk-status-success-text,#0F973D)]',
  successTint:
    'bg-[var(--sdk-status-success-tint-bg,#D4F8D3)] text-[var(--sdk-status-success-tint-text,#151515)]',
  info: 'bg-[var(--sdk-status-info-bg,#EFF6FF)] text-[var(--sdk-status-info-text,#1D4ED8)] border border-[var(--sdk-status-info-border,#BFDBFE)]',
  progress:
    'bg-[var(--sdk-status-progress-bg,#F0F5FF)] text-[var(--sdk-status-progress-text,#1E40AF)] border border-[var(--sdk-status-progress-border,#DBEAFE)]',
  warning:
    'bg-[var(--sdk-status-warning-bg,#FFF7ED)] text-[var(--sdk-status-warning-text,#C2410C)] border border-[var(--sdk-status-warning-border,#FED7AA)]',
  warningAmber:
    'bg-[var(--sdk-status-warning-amber-bg,#FFFBEB)] text-[var(--sdk-status-warning-amber-text,#B45309)] border border-[var(--sdk-status-warning-amber-border,#FDE68A)]',
  danger:
    'bg-[var(--sdk-status-danger-bg,#FEF2F2)] text-[var(--sdk-status-danger-text,#D92D20)]',
  dangerBordered:
    'bg-[var(--sdk-status-danger-bg,#FEF2F2)] text-[var(--sdk-status-danger-text,#D92D20)] border border-[var(--sdk-status-danger-border,#FECACA)]',
  dangerStrong:
    'bg-[var(--sdk-status-danger-bg,#FEF2F2)] text-[var(--sdk-status-danger-strong-text,#B91C1C)] border border-[var(--sdk-status-danger-border,#FECACA)]',
  dangerTint:
    'bg-[var(--sdk-status-danger-tint-bg,#FBE7E9)] text-[var(--sdk-status-danger-tint-text,#151515)]',
  review:
    'bg-[var(--sdk-status-review-bg,#F5F3FF)] text-[var(--sdk-status-review-text,#5B21B6)] border border-[var(--sdk-status-review-border,#DDD6FE)]',
  muted:
    'bg-[var(--sdk-status-muted-bg,#F1F5F9)] text-[var(--sdk-status-muted-text,#475569)] border border-[var(--sdk-status-muted-border,#CBD5E1)]',
  neutral:
    'bg-[var(--sdk-status-neutral-bg,#F9FAFB)] text-[var(--sdk-status-neutral-text,#4B5563)] border border-[var(--sdk-status-neutral-border,#E5E7EB)]',
};

/** Style applied when the badge resolves an empty/undefined status. */
export const statusBadgeEmptyClasses =
  'bg-[var(--sdk-status-empty-bg,#F3F4F6)] text-[var(--sdk-status-empty-text,#4B5563)]';
