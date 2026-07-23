import type { ReactNode } from 'react';
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { nativeFonts } from '@instollar-dev/instollar-tokens';
import { useThemeColors } from '../theme/ThemeProvider';

export type TextVariant =
  | 'spline-bold-display'
  | 'spline-bold-h4'
  | 'spline-bold-h5'
  | 'spline-bold-label'
  | 'spline-regular-p'
  | 'open-bold-h5'
  | 'open-bold-p'
  | 'open-regular-p'
  | 'open-regular-label'
  | 'open-regular-tiny';

const variantStyles: Record<TextVariant, TextStyle> = {
  'spline-bold-display': {
    fontFamily: nativeFonts.spline,
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 44,
  },
  'spline-bold-h4': {
    fontFamily: nativeFonts.spline,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  'spline-bold-h5': {
    fontFamily: nativeFonts.spline,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  'spline-bold-label': {
    fontFamily: nativeFonts.spline,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  'spline-regular-p': {
    fontFamily: nativeFonts.spline,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  'open-bold-h5': {
    fontFamily: nativeFonts.openSans,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  'open-bold-p': {
    fontFamily: nativeFonts.openSans,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  'open-regular-p': {
    fontFamily: nativeFonts.openSans,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  'open-regular-label': {
    fontFamily: nativeFonts.openSans,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  'open-regular-tiny': {
    fontFamily: nativeFonts.openSans,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
};

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  children?: ReactNode;
  muted?: boolean;
};

export function Text({
  variant = 'open-regular-p',
  muted = false,
  style,
  children,
  ...props
}: TextProps) {
  const colors = useThemeColors();
  return (
    <RNText
      {...props}
      style={[
        variantStyles[variant],
        { color: muted ? colors.muted : colors.fg },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
