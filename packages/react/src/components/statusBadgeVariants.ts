export type StatusTone = 'success' | 'destructive' | 'neutral';

export const statusBadgeBaseClasses =
  'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-open-bold-tiny font-semibold capitalize';

export const statusBadgeToneClasses: Record<StatusTone, string> = {
  success: 'bg-primary/14 text-primary',
  destructive: 'bg-destructive/12 text-destructive',
  neutral: 'bg-muted/15 text-muted',
};
