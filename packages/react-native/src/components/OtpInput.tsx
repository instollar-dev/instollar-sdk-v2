import { useEffect, useRef, useState } from 'react';
import {
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Button } from './Button';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';

export type OtpInputProps = {
  length?: number;
  onChange?: (code: string) => void;
  mask?: boolean;
  separatorAfterIndex?: number | null;
  disabled?: boolean;
  'aria-label'?: string;
  showResend?: boolean;
  onResend?: () => void;
  resendText?: string;
  resendLabel?: string;
  resendLoadingText?: string;
  resendLoading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function OtpInput({
  length = 6,
  onChange,
  mask = true,
  separatorAfterIndex = 2,
  disabled = false,
  showResend = true,
  onResend,
  resendText = "Didn't get a code?",
  resendLabel = 'Resend',
  resendLoadingText = 'Sending…',
  resendLoading = false,
  style,
  ...props
}: OtpInputProps) {
  const colors = useThemeColors();
  const [digits, setDigits] = useState<string[]>(() => Array.from({ length }, () => ''));
  const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (visibleIndex === null) return;
    const t = setTimeout(() => setVisibleIndex(null), 500);
    return () => clearTimeout(t);
  }, [visibleIndex]);

  const emit = (next: string[]) => {
    onChange?.(next.join(''));
  };

  const updateAt = (index: number, char: string) => {
    const digit = char.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    emit(next);
    if (digit) {
      setVisibleIndex(index);
      if (index < length - 1) inputs.current[index + 1]?.focus();
    }
  };

  const onKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = '';
      setDigits(next);
      emit(next);
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={[{ gap: 16 }, style]}>
      <View
        accessibilityLabel={props['aria-label'] ?? 'One-time code'}
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        {digits.map((digit, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TextInput
              ref={(el) => {
                inputs.current[index] = el;
              }}
              value={digit}
              onChangeText={(text) => {
                if (text.length > 1) {
                  const chars = text.replace(/\D/g, '').slice(0, length - index).split('');
                  const next = [...digits];
                  chars.forEach((c, i) => {
                    next[index + i] = c;
                  });
                  setDigits(next);
                  emit(next);
                  const focusAt = Math.min(index + chars.length, length - 1);
                  setVisibleIndex(focusAt);
                  inputs.current[focusAt]?.focus();
                  return;
                }
                updateAt(index, text);
              }}
              onKeyPress={({ nativeEvent }) => onKeyPress(index, nativeEvent.key)}
              editable={!disabled}
              keyboardType="number-pad"
              maxLength={length}
              secureTextEntry={mask && visibleIndex !== index && digit !== ''}
              style={{
                width: 44,
                height: 48,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                textAlign: 'center',
                fontSize: 18,
                color: colors.fg,
                backgroundColor: colors.bg,
              }}
            />
            {separatorAfterIndex != null && index === separatorAfterIndex ? (
              <Text variant="spline-bold-h5" muted>
                —
              </Text>
            ) : null}
          </View>
        ))}
      </View>

      {showResend ? (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            paddingHorizontal: 4,
          }}
        >
          <Text
            variant="open-regular-label"
            muted
            style={{ flexShrink: 1, textAlign: 'center', maxWidth: '100%' }}
          >
            {resendText}
          </Text>
          <Button
            variant="underline"
            size="sm"
            loading={resendLoading}
            disabled={disabled || resendLoading}
            onPress={onResend}
          >
            {resendLoading ? resendLoadingText : resendLabel}
          </Button>
        </View>
      ) : null}
    </View>
  );
}

export const VerificationInput = OtpInput;
export type VerificationInputProps = OtpInputProps;
