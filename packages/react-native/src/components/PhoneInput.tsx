import { useMemo, useState } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import {
  COUNTRIES,
  type Country,
} from '@instollar-dev/instollar-core/countries';
import {
  clampNationalDigits,
  createPhoneValue,
  formatNationalNumber,
  resolvePhoneCountry,
  toE164,
  toPhoneCountryOptions,
  type PhoneValue,
} from '@instollar-dev/instollar-core/utils/phone';
import { Text } from './Text';
import { Input } from './Input';
import { Select } from './Select';
import { useThemeColors } from '../theme/ThemeProvider';
import { fieldErrorStyle, fieldLabelStyle } from '../styles/formStyles';

export type PhoneInputProps = {
  label?: string;
  error?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Controlled value (`nationalNumber` is digit-only). */
  value?: PhoneValue | null;
  defaultValue?: PhoneValue;
  /** Used when uncontrolled and no `defaultValue`. Default: `NG`. */
  defaultCountryCode?: string;
  countries?: readonly Country[];
  placeholder?: string;
  onChange?: (value: PhoneValue) => void;
  /** Fires with `+234…` (empty when national number is empty). */
  onE164Change?: (e164: string) => void;
};

export function PhoneInput({
  label,
  error,
  disabled,
  style,
  value,
  defaultValue,
  defaultCountryCode = 'NG',
  countries = COUNTRIES,
  placeholder = 'Phone number',
  onChange,
  onE164Change,
}: PhoneInputProps) {
  const colors = useThemeColors();
  const controlled = value !== undefined;

  const [internal, setInternal] = useState<PhoneValue>(() => {
    if (defaultValue) {
      return createPhoneValue(
        defaultValue.countryCode,
        defaultValue.nationalNumber,
        countries,
      );
    }
    return createPhoneValue(defaultCountryCode, '', countries);
  });

  const current = controlled
    ? value
      ? createPhoneValue(value.countryCode, value.nationalNumber, countries)
      : createPhoneValue(defaultCountryCode, '', countries)
    : internal;

  const country = resolvePhoneCountry(current, defaultCountryCode, countries);
  const options = useMemo(() => toPhoneCountryOptions(countries), [countries]);
  const displayNational = formatNationalNumber(
    current.nationalNumber,
    country.inputFormat,
  );

  function emit(next: PhoneValue) {
    const normalized = createPhoneValue(
      next.countryCode,
      next.nationalNumber,
      countries,
    );
    if (!controlled) setInternal(normalized);
    onChange?.(normalized);
    onE164Change?.(toE164(normalized, countries));
  }

  return (
    <View style={style}>
      {label ? (
        <Text variant="open-regular-label" style={fieldLabelStyle(colors)}>
          {label}
        </Text>
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <View style={{ width: 108, flexShrink: 0 }}>
          <Select
            searchable
            disabled={disabled}
            options={options}
            value={country.countryCode}
            onValueChange={(next) => {
              const code = Array.isArray(next) ? next[0] : next;
              if (!code) return;
              const nextCountry = resolvePhoneCountry(
                { countryCode: code },
                defaultCountryCode,
                countries,
              );
              emit({
                countryCode: code,
                nationalNumber: clampNationalDigits(
                  current.nationalNumber,
                  nextCountry,
                ),
              });
            }}
            placeholder="+…"
          />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Input
            type="tel"
            editable={!disabled}
            placeholder={placeholder}
            value={displayNational}
            onChangeText={(text) => {
              emit({
                countryCode: country.countryCode,
                nationalNumber: clampNationalDigits(text, country),
              });
            }}
            placeholderTextColor={colors.muted}
          />
        </View>
      </View>
      {error ? (
        <Text variant="open-regular-tiny" style={fieldErrorStyle(colors)}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
