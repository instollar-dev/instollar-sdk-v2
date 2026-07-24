import { useState, type ReactNode } from 'react';
import {
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { FieldControl } from './FieldControl';
import { useThemeColors } from '../theme/ThemeProvider';
import { fieldErrorStyle, fieldLabelStyle } from '../styles/formStyles';

export type TextareaProps = Omit<TextInputProps, 'multiline'> & {
  label?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Textarea({
  label,
  error,
  prefix,
  suffix,
  value,
  defaultValue,
  onChangeText,
  editable = true,
  containerStyle,
  style,
  numberOfLines = 4,
  ...props
}: TextareaProps) {
  const colors = useThemeColors();
  const controlled = value !== undefined;
  const [internal, setInternal] = useState(String(defaultValue ?? ''));
  const displayValue = controlled ? String(value) : internal;

  return (
    <View style={containerStyle}>
      {label ? (
        <Text variant="open-regular-label" style={fieldLabelStyle(colors)}>
          {label}
        </Text>
      ) : null}
      <FieldControl
        prefix={prefix}
        suffix={suffix}
        error={Boolean(error)}
        disabled={!editable}
        style={{ alignItems: 'flex-start', minHeight: 96, paddingVertical: 8 }}
      >
        <TextInput
          {...props}
          multiline
          numberOfLines={numberOfLines}
          textAlignVertical="top"
          value={displayValue}
          onChangeText={(text) => {
            if (!controlled) setInternal(text);
            onChangeText?.(text);
          }}
          editable={editable}
          placeholderTextColor={colors.muted}
          style={[
            {
              color: colors.fg,
              fontSize: 16,
              minHeight: 80,
              paddingVertical: 4,
              margin: 0,
            },
            style,
          ]}
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
