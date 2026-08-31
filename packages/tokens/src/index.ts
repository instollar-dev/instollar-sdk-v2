/** Instollar brand anchors from the style guide (stable across themes). */
export const brand = {
  primary: '#012b15',
  /** Amber brand accent — secondary fills, caution, and progress accents. */
  secondary: '#f49e0c',
} as const;

export const fonts = {
  spline: '"Spline Sans", sans-serif',
  inter: '"Inter", sans-serif',
  openSans: '"Open Sans", sans-serif',
} as const;

/** Native font family names (load these in the host RN / Expo app). */
export const nativeFonts = {
  spline: 'SplineSans',
  inter: 'Inter',
  openSans: 'OpenSans',
} as const;

/** Light theme semantic colors (matches `:root` in tokens.css). */
export const colors = {
  brand: brand.primary,
  primary: brand.primary,
  secondary: brand.secondary,
  bg: '#ffffff',
  fg: brand.primary,
  muted: '#6b8074',
  border: '#d6ddd9',
  destructive: '#f49e0c',
  danger: '#dc2626',
  /** Validation / error feedback — red in light. */
  error: '#dc2626',
  white: '#ffffff',
} as const;

/** Dark theme semantic colors (matches `[data-theme="dark"]` in tokens.css). */
export const darkColors = {
  brand: brand.primary,
  primary: '#8fc9a5',
  secondary: brand.secondary,
  bg: '#24382f',
  fg: '#edf6f0',
  muted: '#9bb0a5',
  border: '#3d5248',
  destructive: '#fbbf24',
  danger: '#ef4444',
  /** Validation / error feedback — amber in dark. */
  error: '#fbbf24',
  white: '#ffffff',
} as const;

export type ThemeColors = {
  brand: string;
  primary: string;
  secondary: string;
  bg: string;
  fg: string;
  muted: string;
  border: string;
  destructive: string;
  danger: string;
  error: string;
  white: string;
};

export type ColorScheme = 'light' | 'dark';

export function getThemeColors(scheme: ColorScheme): ThemeColors {
  return scheme === 'dark' ? darkColors : colors;
}
