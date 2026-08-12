import { useEffect, useState, type ReactNode } from 'react';
import {
  Pressable,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { FieldControl } from './FieldControl';
import { Icon, Eye, EyeSlash } from './Icon';
import { useThemeColors } from '../theme/ThemeProvider';
import { fieldErrorStyle, fieldLabelStyle, fieldControlTextStyle } from '../styles/formStyles';
import {
  formatNumberInput,
  numberInputDisplayValue,
  sanitizeNumberInput,
} from '../utils/numberInputUtils';
import { triggerHapticFeedback } from '../utils/haptics';

export type InputProps = Omit<TextInputProps, 'onChange'> & {
  label?: string;
  error?: string;
  /** Error border without rendering error text (e.g. compound fields). */
  invalid?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** When set, called with the string value (raw for number type). */
  onChangeText?: (text: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  /** Web-parity: treat as password field with visibility toggle. */
  secureTextEntry?: boolean;
  type?: 'text' | 'password' | 'number' | 'email' | 'tel' | 'url';
};

export function Input({
  label,
  error,
  invalid,
  prefix,
  suffix,
  value,
  defaultValue,
  onChangeText,
  editable = true,
  secureTextEntry,
  type = 'text',
  containerStyle,
  style,
  ...props
}: InputProps) {
  const colors = useThemeColors();
  const isPassword = type === 'password' || secureTextEntry;
  const isNumber = type === 'number';
  const [visible, setVisible] = useState(false);
  const [internal, setInternal] = useState(() =>
    isNumber ? numberInputDisplayValue(defaultValue as string | number | undefined) : String(defaultValue ?? ''),
  );

  useEffect(() => {
    if (!isPassword) setVisible(false);
  }, [isPassword]);

  const controlled = value !== undefined;
  const displayValue = controlled
    ? isNumber
      ? numberInputDisplayValue(value as string | number)
      : String(value)
    : internal;

  const handleChange = (text: string) => {
    if (isNumber) {
      const raw = sanitizeNumberInput(text);
      const formatted = formatNumberInput(text);
      if (!controlled) setInternal(formatted);
      onChangeText?.(raw);
      return;
    }
    if (!controlled) setInternal(text);
    onChangeText?.(text);
  };

  const passwordToggle = isPassword ? (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={visible ? 'Hide password' : 'Show password'}
      disabled={!editable}
      onPress={() => {
        triggerHapticFeedback('selection');
        setVisible((v) => !v);
      }}
      hitSlop={8}
    >
      <Icon icon={visible ? EyeSlash : Eye} size="sm" color="muted" />
    </Pressable>
  ) : null;

  return (
    <View style={containerStyle}>
      {label ? (
        <Text variant="open-regular-label" style={fieldLabelStyle(colors)}>
          {label}
        </Text>
      ) : null}
      <FieldControl
        prefix={prefix}
        suffix={suffix ?? passwordToggle}
        error={Boolean(error) || Boolean(invalid)}
        disabled={!editable}
        style={{ height: 44 }}
      >
        <TextInput
          {...props}
          value={displayValue}
          onChangeText={handleChange}
          editable={editable}
          secureTextEntry={Boolean(isPassword && !visible)}
          keyboardType={
            isNumber ? 'decimal-pad' : type === 'email' ? 'email-address' : type === 'tel' ? 'phone-pad' : 'default'
          }
          autoCapitalize={type === 'email' ? 'none' : props.autoCapitalize}
          placeholderTextColor={colors.muted}
          style={[{ color: colors.fg }, fieldControlTextStyle, style]}
        />
      </FieldControl>
      {error ? (
        <Text variant="open-regular-tiny" style={fieldErrorStyle(colors)}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
