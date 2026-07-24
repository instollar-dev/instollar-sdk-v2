import type { ThemeColors } from '@instollar-dev/instollar-tokens';
import type { TextStyle, ViewStyle } from 'react-native';

export function fieldLabelStyle(colors: ThemeColors): TextStyle {
  return {
    color: colors.fg,
    marginBottom: 6,
  };
}

export function fieldErrorStyle(colors: ThemeColors): TextStyle {
  return {
    color: colors.destructive,
    marginTop: 6,
  };
}

export function fieldDescriptionStyle(colors: ThemeColors): TextStyle {
  return {
    color: colors.muted,
    marginTop: 4,
  };
}

export function fieldControlSurface(
  colors: ThemeColors,
  opts: { error?: boolean; disabled?: boolean } = {},
): ViewStyle {
  return {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: opts.error ? colors.destructive : colors.border,
    backgroundColor: colors.bg,
    opacity: opts.disabled ? 0.5 : 1,
    minHeight: 44,
    paddingHorizontal: 12,
  };
}
