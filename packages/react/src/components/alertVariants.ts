export type AlertVariant = 'success' | 'error' | 'destructive' | 'warning' | 'info';

/** Soft tinted surface + left accent bar — inline alerts, forms */
export const alertContainerClasses: Record<AlertVariant, string> = {
  success: 'bg-primary/7 border-l-primary',
  error: 'bg-destructive/7 border-l-destructive/55',
  destructive: 'bg-destructive/10 border-l-destructive',
  warning: 'bg-secondary/40 border-l-secondary',
  info: 'bg-primary/7 border-l-primary/50',
};

/** Opaque surface — toasts overlay page content */
export const toastContainerClasses: Record<AlertVariant, string> = {
  success: 'bg-background border border-border border-l-primary',
  error: 'bg-background border border-border border-l-destructive',
  destructive: 'bg-background border border-border border-l-destructive',
  warning: 'bg-background border border-border border-l-secondary',
  info: 'bg-background border border-border border-l-primary',
};

/** Soft circular icon chip background + icon color */
export const alertIconChipClasses: Record<AlertVariant, string> = {
  success: 'bg-primary/16 text-primary',
  error: 'bg-destructive/16 text-destructive',
  destructive: 'bg-destructive/20 text-destructive',
  warning: 'bg-secondary/50 text-foreground',
  info: 'bg-primary/14 text-primary',
};

/** @deprecated use alertContainerClasses + alertIconChipClasses */
export const alertVariantClasses = alertContainerClasses;

export function toastVariantFromApi(type: 'success' | 'error'): AlertVariant {
  return type === 'success' ? 'success' : 'error';
}
