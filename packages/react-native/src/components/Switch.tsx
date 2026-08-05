import { useState, type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';
import { fieldDescriptionStyle, fieldErrorStyle } from '../styles/formStyles';
import { triggerHapticFeedback } from '../utils/haptics';

export type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  description?: string;
  error?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  label,
  description,
  error,
  disabled = false,
  style,
}: SwitchProps) {
  const colors = useThemeColors();
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
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: isChecked, disabled }}
        disabled={disabled}
        onPress={toggle}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 12, opacity: disabled ? 0.5 : 1 }}
      >
        <View
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            padding: 2,
            backgroundColor: isChecked ? colors.brand : colors.border,
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: colors.white,
              alignSelf: isChecked ? 'flex-end' : 'flex-start',
            }}
          />
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
      </Pressable>
      {error ? (
        <Text variant="open-regular-tiny" style={fieldErrorStyle(colors)}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
