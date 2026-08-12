import { useMemo, useState } from 'react';
import {
  Image,
  Text as RNText,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  COUNTRIES,
  type Country,
} from '@instollar-dev/instollar-core/countries';
import {
  clampNationalDigits,
  countryCodeToFlagEmoji,
  createPhoneValue,
  formatNationalNumber,
  resolvePhoneCountry,
  toE164,
  toPhoneCountryOptions,
  type PhoneValue,
} from '@instollar-dev/instollar-core/utils/phone';
import { Text } from './Text';
import { Input } from './Input';
import { Select, type SelectOption } from './Select';
import { useResolvedScheme, useThemeColors } from '../theme/ThemeProvider';
import { fieldErrorStyle, fieldLabelStyle } from '../styles/formStyles';

const FLAG_BOX_SIZE = 22;
const FLAG_IMAGE_WIDTH = 20;
const FLAG_IMAGE_HEIGHT = 15;

/** flagcdn.com URL for an ISO 3166-1 alpha-2 country code. */
function flagImageUrl(countryCode: string): string {
  return `https://flagcdn.com/w40/${countryCode.trim().toLowerCase()}.png`;
}

/**
 * Country flag image (flagcdn.com), falling back to the emoji flag
 * (system font, so it renders even under custom UI fonts) if the
 * image fails to load — e.g. offline, or an unmapped country code.
 */
function CountryFlag({ code, size = FLAG_BOX_SIZE }: { code: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const emoji = countryCodeToFlagEmoji(code);
  const showImage = Boolean(code) && !failed;

  return (
    <View
      style={{
        width: size,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {showImage ? (
        <Image
          source={{ uri: flagImageUrl(code) }}
          onError={() => setFailed(true)}
          resizeMode="cover"
          style={{
            width: FLAG_IMAGE_WIDTH,
            height: FLAG_IMAGE_HEIGHT,
            borderRadius: 2,
          }}
        />
      ) : emoji ? (
        <RNText style={{ fontSize: size - 4, lineHeight: 20 }}>{emoji}</RNText>
      ) : null}
    </View>
  );
}

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
  const scheme = useResolvedScheme();
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

  const dialCodeOptions = useMemo<SelectOption<string>[]>(
    () =>
      toPhoneCountryOptions(countries).map((opt) => ({
        value: opt.value,
        label: opt.label,
        description: opt.description,
        prefix: <CountryFlag code={opt.value} />,
      })),
    [countries],
  );

  const dialSelectedColor = scheme === 'dark' ? colors.destructive : undefined;
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

  function handleCountryChange(next: string | string[] | null) {
    const code = Array.isArray(next) ? next[0] : next;
    if (!code) return;
    const nextCountry = resolvePhoneCountry(
      { countryCode: code },
      defaultCountryCode,
      countries,
    );
    emit({
      countryCode: code,
      nationalNumber: clampNationalDigits(current.nationalNumber, nextCountry),
    });
  }

  function handleNumberChange(text: string) {
    emit({
      countryCode: country.countryCode,
      nationalNumber: clampNationalDigits(text, country),
    });
  }

  return (
    <View style={style}>
      {label ? (
        <Text variant="open-regular-label" style={fieldLabelStyle(colors)}>
          {label}
        </Text>
      ) : null}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <View style={{ width: 128, flexShrink: 0 }}>
          <Select
            searchable
            presentation="sheet"
            searchPlaceholder="Search country or code…"
            disabled={disabled}
            options={dialCodeOptions}
            value={country.countryCode}
            prefix={<CountryFlag code={country.countryCode} />}
            selectedColor={dialSelectedColor}
            onValueChange={handleCountryChange}
            placeholder="+…"
          />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Input
            type="tel"
            editable={!disabled}
            placeholder={placeholder}
            value={displayNational}
            onChangeText={handleNumberChange}
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
