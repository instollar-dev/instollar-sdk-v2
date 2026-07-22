/** Instollar brand anchors from the style guide (stable across themes). */
export const brand = {
  primary: '#012b15',
  secondary: '#effe3e',
} as const;

export const fonts = {
  spline: '"Spline Sans", sans-serif',
  inter: '"Inter", sans-serif',
  openSans: '"Open Sans", sans-serif',
} as const;

/** Light theme semantic colors (matches `:root` in tokens.css). */
export const colors = {
  brand: brand.primary,
  primary: brand.primary,
  secondary: brand.secondary,
  bg: '#ffffff',
  fg: brand.primary,
  destructive: '#f49e0c',
  danger: '#dc2626',
} as const;

/** Dark theme semantic colors (matches `[data-theme="dark"]` in tokens.css). */
export const darkColors = {
  brand: brand.primary,
  primary: '#8fc9a5',
  secondary: brand.secondary,
  bg: '#24382f',
  fg: '#edf6f0',
  destructive: '#fbbf24',
  danger: '#ef4444',
} as const;
