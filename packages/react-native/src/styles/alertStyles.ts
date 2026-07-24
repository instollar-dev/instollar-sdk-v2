import type { ThemeColors } from '@instollar-dev/instollar-tokens';
import type { ViewStyle } from 'react-native';

export type AlertVariant = 'success' | 'error' | 'destructive' | 'warning' | 'info';

export function alertContainerStyle(
  colors: ThemeColors,
  variant: AlertVariant,
  appearance: 'inline' | 'toast',
): ViewStyle {
  const soft: Record<AlertVariant, ViewStyle> = {
    success: { backgroundColor: '#E8FDF0', borderColor: '#0F973D' },
    error: { backgroundColor: '#FEF2F2', borderColor: colors.danger },
    destructive: { backgroundColor: '#FFF7ED', borderColor: colors.destructive },
    warning: { backgroundColor: '#FFFBEB', borderColor: '#B45309' },
    info: { backgroundColor: '#EFF6FF', borderColor: '#1D4ED8' },
  };

  const toast: Record<AlertVariant, ViewStyle> = {
    success: { backgroundColor: colors.bg, borderColor: '#0F973D' },
    error: { backgroundColor: colors.bg, borderColor: colors.danger },
    destructive: { backgroundColor: colors.bg, borderColor: colors.destructive },
    warning: { backgroundColor: colors.bg, borderColor: '#B45309' },
    info: { backgroundColor: colors.bg, borderColor: '#1D4ED8' },
  };

  return {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 12,
    ...(appearance === 'toast' ? toast[variant] : soft[variant]),
  };
}

export function alertIconColor(colors: ThemeColors, variant: AlertVariant): string {
  const map: Record<AlertVariant, string> = {
    success: colors.primary,
    error: colors.danger,
    destructive: colors.destructive,
    warning: colors.fg,
    info: colors.primary,
  };
  return map[variant];
}
