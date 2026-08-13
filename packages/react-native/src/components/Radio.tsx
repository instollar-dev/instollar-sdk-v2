import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { DismissKeyboardPressable } from './DismissKeyboardPressable';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';
import { fieldDescriptionStyle, fieldErrorStyle, fieldLabelStyle } from '../styles/formStyles';
import { triggerHapticFeedback } from '../utils/haptics';

type RadioContextValue = {
  value?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
};

const RadioContext = createContext<RadioContextValue>({});

export type RadioGroupProps = {
  label?: string;
  description?: string;
  error?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function RadioGroup({
  label,
  description,
  error,
  value,
  defaultValue,
  onValueChange,
  disabled,
  children,
  style,
}: RadioGroupProps) {
  const colors = useThemeColors();
  const controlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue);
  const current = controlled ? value : internal;

  const ctx = useMemo(
    () => ({
      value: current,
      disabled,
      onValueChange: (next: string) => {
        if (!controlled) setInternal(next);
        onValueChange?.(next);
      },
    }),
    [current, disabled, controlled, onValueChange],
  );

  return (
    <RadioContext.Provider value={ctx}>
      <View style={[{ gap: 8 }, style]} accessibilityRole="radiogroup">
        {label ? (
          <Text variant="open-regular-label" style={fieldLabelStyle(colors)}>
            {label}
          </Text>
        ) : null}
        {description ? (
          <Text variant="open-regular-tiny" style={fieldDescriptionStyle(colors)}>
            {description}
          </Text>
        ) : null}
        <View style={{ gap: 10 }}>{children}</View>
        {error ? (
          <Text variant="open-regular-tiny" style={fieldErrorStyle(colors)}>
            {error}
          </Text>
        ) : null}
      </View>
    </RadioContext.Provider>
  );
}

export type RadioProps = {
  value: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Radio({ value, label, description, disabled, style }: RadioProps) {
  const colors = useThemeColors();
  const ctx = useContext(RadioContext);
  const isDisabled = Boolean(disabled || ctx.disabled);
  const selected = ctx.value === value;

  return (
    <DismissKeyboardPressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={() => {
        if (isDisabled || selected) return;
        triggerHapticFeedback('selection');
        ctx.onValueChange?.(value);
      }}
      style={[
        { flexDirection: 'row', alignItems: 'flex-start', gap: 10, opacity: isDisabled ? 0.5 : 1 },
        style,
      ]}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: selected ? colors.brand : colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 2,
        }}
      >
        {selected ? (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: colors.brand,
            }}
          />
        ) : null}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        {label ? <Text variant="open-regular-p">{label}</Text> : null}
        {description ? (
          <Text variant="open-regular-tiny" style={fieldDescriptionStyle(colors)}>
            {description}
          </Text>
        ) : null}
      </View>
    </DismissKeyboardPressable>
  );
}
