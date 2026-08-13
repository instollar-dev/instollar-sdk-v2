import { useEffect, useState, type ReactNode } from 'react';
import {
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { DismissKeyboardPressable } from './DismissKeyboardPressable';
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
  /** Non-editable trigger (e.g. date picker) without dimmed border opacity. */
  readOnly?: boolean;
  /** Opens a picker/sheet when `readOnly` (preferred over wrapping in Pressable). */
  onPress?: () => void;
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
  readOnly = false,
  onPress,
  secureTextEntry,
  type = 'text',
  containerStyle,
  style,
  ...props
}: InputProps) {
  const colors = useThemeColors();
  const isEditable = editable && !readOnly;
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
    <DismissKeyboardPressable
      accessibilityRole="button"
      accessibilityLabel={visible ? 'Hide password' : 'Show password'}
      disabled={!isEditable}
      dismissKeyboard={false}
      onPress={() => {
        triggerHapticFeedback('selection');
        setVisible((v) => !v);
      }}
      hitSlop={8}
    >
      <Icon icon={visible ? EyeSlash : Eye} size="sm" color="muted" />
    </DismissKeyboardPressable>
  ) : null;

  const control = (
    <FieldControl
      prefix={prefix}
      suffix={suffix ?? passwordToggle}
      error={Boolean(error) || Boolean(invalid)}
      disabled={!isEditable && !readOnly}
      style={{ height: 44 }}
    >
      <TextInput
        {...props}
        value={displayValue}
        onChangeText={handleChange}
        editable={isEditable}
        pointerEvents={readOnly ? 'none' : props.pointerEvents}
        secureTextEntry={Boolean(isPassword && !visible)}
        keyboardType={
          isNumber ? 'decimal-pad' : type === 'email' ? 'email-address' : type === 'tel' ? 'phone-pad' : 'default'
        }
        autoCapitalize={type === 'email' ? 'none' : props.autoCapitalize}
        placeholderTextColor={colors.muted}
        style={[{ color: colors.fg }, fieldControlTextStyle, style]}
      />
    </FieldControl>
  );

  const body = (
    <>
      {label ? (
        <Text variant="open-regular-label" style={fieldLabelStyle(colors)}>
          {label}
        </Text>
      ) : null}
      {readOnly && !onPress ? <View pointerEvents="none">{control}</View> : control}
      {error ? (
        <Text variant="open-regular-tiny" style={fieldErrorStyle(colors)}>
          {error}
        </Text>
      ) : null}
    </>
  );

  if (readOnly && onPress) {
    return (
      <DismissKeyboardPressable accessibilityRole="button" onPress={onPress} style={containerStyle}>
        {body}
      </DismissKeyboardPressable>
    );
  }

  return (
    <View style={containerStyle} pointerEvents={readOnly ? 'box-none' : undefined}>
      {body}
    </View>
  );
}
