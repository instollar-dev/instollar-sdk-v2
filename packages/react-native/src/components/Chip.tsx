import type { ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { DismissKeyboardPressable } from './DismissKeyboardPressable';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';
import { triggerHapticFeedback } from '../utils/haptics';

export type ChipProps = {
  selected?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Chip({
  selected = false,
  prefix,
  suffix,
  children,
  disabled,
  onPress,
  style,
}: ChipProps) {
  const colors = useThemeColors();

  return (
    <DismissKeyboardPressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPressIn={() => {
        if (!disabled) triggerHapticFeedback('light');
      }}
      onPress={onPress}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected ? `${colors.primary}22` : colors.bg,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {prefix}
      {typeof children === 'string' ? (
        <Text
          variant="open-regular-label"
          style={{ color: selected ? colors.primary : colors.fg }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
      {suffix}
    </DismissKeyboardPressable>
  );
}
