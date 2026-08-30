import { useId, useMemo, useState, type CSSProperties } from 'react';
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
import { cn } from '../utils/cn';
import { formFieldErrorClass, formFieldLabelClass } from './formVariants';
import { Input } from './Input';
import Select, { type SelectOption } from './Select';

function FlagEmoji({ code, className }: { code: string; className?: string }) {
  const flag = countryCodeToFlagEmoji(code);
  if (!flag) return null;
  return (
    <span className={cn('text-base leading-none', className)} aria-hidden>
      {flag}
    </span>
  );
}

export type PhoneInputProps = {
  label?: string;
  error?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
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
  id,
  className,
  style,
  value,
  defaultValue,
  defaultCountryCode = 'NG',
  countries = COUNTRIES,
  placeholder = 'Phone number',
  onChange,
  onE164Change,
}: PhoneInputProps) {
  const generatedId = useId();
  const inputId =
    id ?? (label ? `${label.toLowerCase().replace(/\s+/g, '-')}-phone` : generatedId);
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
  const options = useMemo<SelectOption<string>[]>(
    () =>
      toPhoneCountryOptions(countries).map((opt) => ({
        value: opt.value,
        label: opt.label,
        description: opt.description,
        prefix: opt.flag ? (
          <span className="text-base leading-none" aria-hidden>
            {opt.flag}
          </span>
        ) : undefined,
      })),
    [countries],
  );
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
    <div className={cn('flex flex-col gap-1', className)} style={style}>
      {label ? (
        <label htmlFor={inputId} className={formFieldLabelClass}>
          {label}
        </label>
      ) : null}
      <div className="flex items-start gap-2">
        <div className="w-[8.5rem] shrink-0">
          <Select
            searchable
            disabled={disabled}
            options={options}
            value={country.countryCode}
            prefix={<FlagEmoji code={country.countryCode} />}
            onChange={(next: any) => {
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
        </div>
        <div className="min-w-0 flex-1">
          <Input
            id={inputId}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            disabled={disabled}
            placeholder={placeholder}
            value={displayNational}
            onChange={(event) => {
              emit({
                countryCode: country.countryCode,
                nationalNumber: clampNationalDigits(event.target.value, country),
              });
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
          />
        </div>
      </div>
      {error ? (
        <p id={`${inputId}-error`} role="alert" className={formFieldErrorClass}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
