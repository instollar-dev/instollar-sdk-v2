import { COUNTRIES, type Country } from '../core/app/countries';

export type PhoneParts = {
  phoneCode: string;
  nationalNumber: string;
};

/** Controlled phone value — ISO country + national digits (no formatting). */
export type PhoneValue = {
  countryCode: string;
  nationalNumber: string;
};

export type PhoneCountryOption = {
  value: string;
  label: string;
  description: string;
};

export function formatPhoneForApi(value?: PhoneParts | null): string {
  if (!value?.nationalNumber?.trim()) return '';
  const code = value.phoneCode.replace(/^\+/, '');
  const national = value.nationalNumber.replace(/\D/g, '');
  return `${code}${national}`;
}

export function normalizePhoneForApi(phone?: string | null): string {
  if (phone == null) return '';
  return phone.trim().replace(/\+/g, '');
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function getCountryByCode(
  countryCode: string,
  countries: readonly Country[] = COUNTRIES,
): Country | undefined {
  const code = countryCode.trim().toUpperCase();
  return countries.find((c) => c.countryCode.toUpperCase() === code);
}

export function getCountryByPhoneCode(
  phoneCode: string,
  countries: readonly Country[] = COUNTRIES,
): Country | undefined {
  const normalized = phoneCode.trim().startsWith('+')
    ? phoneCode.trim()
    : `+${phoneCode.trim()}`;
  return countries.find((c) => c.phoneCode === normalized);
}

/** Options for country dial-code Select (`value` = ISO alpha-2). */
export function toPhoneCountryOptions(
  countries: readonly Country[] = COUNTRIES,
): PhoneCountryOption[] {
  return countries.map((c) => ({
    value: c.countryCode,
    label: c.phoneCode,
    description: c.name,
  }));
}

/**
 * Apply a country's `inputFormat` (e.g. `### ### ####`) to digit-only input.
 * Digits beyond the pattern's `#` count are appended ungrouped.
 */
export function formatNationalNumber(digits: string, inputFormat: string): string {
  const cleaned = digitsOnly(digits);
  if (!cleaned) return '';

  let result = '';
  let digitIndex = 0;

  for (const char of inputFormat) {
    if (digitIndex >= cleaned.length) break;
    if (char === '#') {
      result += cleaned[digitIndex++];
    } else if (digitIndex < cleaned.length) {
      result += char;
    }
  }

  if (digitIndex < cleaned.length) {
    result += cleaned.slice(digitIndex);
  }

  return result;
}

export function clampNationalDigits(
  digits: string,
  country: Country | undefined,
): string {
  const cleaned = digitsOnly(digits);
  if (!country) return cleaned;
  return cleaned.slice(0, country.phoneLength);
}

export function validateNationalNumber(
  digits: string,
  country: Country | undefined,
): { valid: boolean; message?: string } {
  if (!country) {
    return { valid: false, message: 'Unknown country' };
  }
  const cleaned = digitsOnly(digits);
  if (!cleaned) {
    return { valid: false, message: 'Phone number is required' };
  }
  if (cleaned.length !== country.phoneLength) {
    return {
      valid: false,
      message: `Enter a ${country.phoneLength}-digit number for ${country.name}`,
    };
  }
  return { valid: true };
}

export function resolvePhoneCountry(
  value: Pick<PhoneValue, 'countryCode'> | null | undefined,
  defaultCountryCode = 'NG',
  countries: readonly Country[] = COUNTRIES,
): Country {
  const code = value?.countryCode || defaultCountryCode;
  return (
    getCountryByCode(code, countries) ??
    getCountryByCode(defaultCountryCode, countries) ??
    countries[0]!
  );
}

export function phoneValueToParts(
  value: PhoneValue | null | undefined,
  countries: readonly Country[] = COUNTRIES,
): PhoneParts | null {
  if (!value?.nationalNumber?.trim()) return null;
  const country = getCountryByCode(value.countryCode, countries);
  if (!country) return null;
  return {
    phoneCode: country.phoneCode,
    nationalNumber: digitsOnly(value.nationalNumber),
  };
}

/** Digits only, no `+` — matches existing API style (`234801…`). */
export function formatPhoneValueForApi(
  value: PhoneValue | null | undefined,
  countries: readonly Country[] = COUNTRIES,
): string {
  return formatPhoneForApi(phoneValueToParts(value, countries));
}

/** E.164-ish with leading `+` (`+234801…`). Empty when national is empty. */
export function toE164(
  value: PhoneValue | null | undefined,
  countries: readonly Country[] = COUNTRIES,
): string {
  const parts = phoneValueToParts(value, countries);
  if (!parts) return '';
  const code = parts.phoneCode.startsWith('+')
    ? parts.phoneCode
    : `+${parts.phoneCode}`;
  return `${code}${parts.nationalNumber}`;
}

export function createPhoneValue(
  countryCode: string,
  nationalNumber = '',
  countries: readonly Country[] = COUNTRIES,
): PhoneValue {
  const country = getCountryByCode(countryCode, countries);
  return {
    countryCode: country?.countryCode ?? countryCode.toUpperCase(),
    nationalNumber: clampNationalDigits(nationalNumber, country),
  };
}
