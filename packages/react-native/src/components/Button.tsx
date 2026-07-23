import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'underline'
  | 'destructive'
  | 'danger';
export type ButtonTone = 'default' | 'destructive' | 'danger';
export type ButtonSize = 'default' | 'sm';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  loading?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  variant = 'primary',
  tone = 'default',
  size = 'default',
  loading = false,
  disabled,
  prefix,
  suffix,
  children,
  style,
  ...props
}: ButtonProps) {
  const colors = useThemeColors();
  const isSoft = variant === 'ghost' || variant === 'underline';
  const isDisabled = Boolean(disabled || loading);

  let backgroundColor = 'transparent';
  let borderColor = 'transparent';
  let labelColor = colors.fg;
  let borderWidth = 0;

  if (!isSoft) {
    const fill: Record<Exclude<ButtonVariant, 'ghost' | 'underline'>, string> = {
      primary: colors.brand,
      secondary: colors.secondary,
      destructive: colors.destructive,
      danger: colors.danger,
    };
    backgroundColor = fill[variant];
    labelColor = variant === 'secondary' ? colors.brand : colors.white;
  } else {
    borderWidth = variant === 'ghost' ? 1 : 0;
    const toneColor =
      tone === 'destructive'
        ? colors.destructive
        : tone === 'danger'
          ? colors.danger
          : colors.fg;
    labelColor = toneColor;
    borderColor = tone === 'default' ? colors.border : toneColor;
  }

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        variant === 'underline' && styles.underline,
        {
          backgroundColor,
          borderColor,
          borderWidth,
          opacity: isDisabled ? 0.5 : pressed ? 0.9 : 1,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={labelColor} size="small" />
      ) : (
        <View style={styles.row}>
          {prefix}
          {typeof children === 'string' || typeof children === 'number' ? (
            <Text
              variant="spline-bold-label"
              style={[
                { color: labelColor },
                variant === 'underline' && styles.underlineLabel,
              ]}
            >
              {children}
            </Text>
          ) : (
            children
          )}
          {suffix}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  md: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sm: {
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  underline: {
    borderRadius: 0,
    paddingHorizontal: 0,
  },
  underlineLabel: {
    textDecorationLine: 'underline',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
