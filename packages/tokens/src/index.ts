/** Instollar brand anchors from the style guide. */
export const brand = {
  primary: '#012b15',
  secondary: '#effe3e',
} as const;

export const fonts = {
  spline: '"Spline Sans", sans-serif',
  inter: '"Inter", sans-serif',
  openSans: '"Open Sans", sans-serif',
} as const;

export const colors = {
  primary: brand.primary,
  secondary: brand.secondary,
  bg: '#ffffff',
  fg: brand.primary,
  destructive: '#b42318',
} as const;
