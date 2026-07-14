export type FieldSurface = 'light' | 'dark';

export const formControlVariantClasses: Record<FieldSurface, string> = {
  light: 'bg-white border-border text-foreground',
  dark: 'bg-primary/35 border-white/14 text-white',
};

export const formFieldLabelClass = 'text-open-regular-label text-foreground';
export const formFieldErrorClass = 'text-open-regular-tiny text-destructive';
export const formFieldDescriptionClass = 'text-open-regular-tiny text-muted';
