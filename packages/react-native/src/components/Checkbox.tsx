import { useState, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { DismissKeyboardPressable } from './DismissKeyboardPressable';
import { Text } from './Text';
import { useResolvedScheme, useThemeColors } from '../theme/ThemeProvider';
import { fieldDescriptionStyle, fieldErrorStyle } from '../styles/formStyles';
import { triggerHapticFeedback } from '../utils/haptics';

export type CheckboxProps = {
  label?: ReactNode;
  description?: string;
  error?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Checkbox({
  label,
  description,
  error,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  style,
}: CheckboxProps) {
  const colors = useThemeColors();
  const scheme = useResolvedScheme();
  // Amber in dark, brand green in light — same accent pattern as Select.
  const accent = scheme === 'dark' ? colors.destructive : colors.brand;
  const controlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const isChecked = controlled ? Boolean(checked) : internal;

  const toggle = () => {
    if (disabled) return;
    triggerHapticFeedback('selection');
    const next = !isChecked;
    if (!controlled) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <View style={[{ gap: 4 }, style]}>
      <DismissKeyboardPressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isChecked, disabled }}
        disabled={disabled}
        onPress={toggle}
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 10,
          opacity: disabled ? 0.5 : 1,
        }}>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 1.5,
            borderColor: error ? colors.error : isChecked ? accent : colors.border,
            backgroundColor: isChecked ? accent : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 2,
          }}>
          {isChecked ? (
            <Text
              variant="open-regular-tiny"
              style={{ color: colors.white, fontWeight: '700' }}>
              ✓
            </Text>
          ) : null}
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          {label ? (
            typeof label === 'string' ? (
              <Text variant="open-regular-p">{label}</Text>
            ) : (
              label
            )
          ) : null}
          {description ? (
            <Text variant="open-regular-tiny" style={fieldDescriptionStyle(colors)}>
              {description}
            </Text>
          ) : null}
        </View>
      </DismissKeyboardPressable>
      {error ? (
        <Text variant="open-regular-tiny" style={fieldErrorStyle(colors)}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
