/**
 * Iconsax paints via the SVG `color` prop (fill/stroke), not CSS `currentColor` alone.
 * Always pass these (or `currentColor`) — Tailwind `text-*` classes will not show Iconsax icons.
 */
export const iconPaint = {
  current: 'currentColor',
  brand: 'var(--color-brand, #012b15)',
  primary: 'var(--color-primary, #012b15)',
  secondary: 'var(--color-secondary, #effe3e)',
  muted: 'var(--color-muted, #6b8074)',
  inverse: '#ffffff',
  destructive: 'var(--color-destructive, #b42318)',
  foreground: 'var(--color-fg, var(--color-brand, #012b15))',
} as const;

export type IconPaint = keyof typeof iconPaint;
