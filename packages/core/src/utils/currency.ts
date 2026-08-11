import { COUNTRIES } from '../core/app/countries';

const DEFAULT_CURRENCY = 'NGN';

/** ISO 4217 currency code for a country (falls back to NGN). */
export function resolveCurrencyFromCountryCode(
  countryCode: string | null | undefined,
): string {
  const code = countryCode?.trim().toUpperCase();
  if (!code) return DEFAULT_CURRENCY;

  return (
    COUNTRIES.find((country) => country.countryCode.toUpperCase() === code)
      ?.currency ?? DEFAULT_CURRENCY
  );
}
