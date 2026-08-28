import { useState, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { DismissKeyboardPressable } from './DismissKeyboardPressable';
import { Spinner } from './Spinner';
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
  /** Shows a spinner in place of the track and blocks interaction (like Button.loading). */
  loading?: boolean;
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
  loading = false,
  style,
}: SwitchProps) {
  const colors = useThemeColors();
  const controlled = checked !== undefined;
  const [internal, setInternal] = useState(defaultChecked);
  const isChecked = controlled ? Boolean(checked) : internal;
  const isDisabled = Boolean(disabled || loading);
  const hasCopy = Boolean(label || description);

  const toggle = () => {
    if (isDisabled) return;
    triggerHapticFeedback('selection');
    const next = !isChecked;
    if (!controlled) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <View style={[{ gap: 4 }, style]}>
      <DismissKeyboardPressable
        accessibilityRole="switch"
        accessibilityState={{ checked: isChecked, disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        onPress={toggle}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          opacity: isDisabled && !loading ? 0.5 : 1,
        }}
      >
        {loading ? (
          <View
            style={{
              width: 44,
              height: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spinner size={18} color={colors.primary} />
          </View>
        ) : (
          <View
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              // Android drops rounded corners when the track backgroundColor flips
              // unless the view clips its children.
              overflow: 'hidden',
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
        )}
        {hasCopy ? (
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
        ) : null}
      </DismissKeyboardPressable>
      {error ? (
        <Text variant="open-regular-tiny" style={fieldErrorStyle(colors)}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
