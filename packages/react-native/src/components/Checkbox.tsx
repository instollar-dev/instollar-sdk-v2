import { useState, type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';
import { fieldDescriptionStyle, fieldErrorStyle } from '../styles/formStyles';

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
  const controlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const isChecked = controlled ? Boolean(checked) : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (!controlled) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <View style={[{ gap: 4 }, style]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isChecked, disabled }}
        disabled={disabled}
        onPress={toggle}
        style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, opacity: disabled ? 0.5 : 1 }}
      >
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 1.5,
            borderColor: error ? colors.destructive : isChecked ? colors.brand : colors.border,
            backgroundColor: isChecked ? colors.brand : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 2,
          }}
        >
          {isChecked ? (
            <Text variant="open-regular-tiny" style={{ color: colors.white, fontWeight: '700' }}>
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
      </Pressable>
      {error ? (
        <Text variant="open-regular-tiny" style={fieldErrorStyle(colors)}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
