import { Eye, EyeSlash } from 'iconsax-react';
import {
  useEffect,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { useThemeOptional } from '../theme/ThemeProvider';
import { cn } from '../utils/cn';
import { FieldControl } from './FieldControl';
import type { FieldSurface } from './formVariants';
import { formFieldErrorClass, formFieldLabelClass } from './formVariants';
import {
  formatNumberInput,
  numberInputDisplayValue,
  sanitizeNumberInput,
} from './numberInputUtils';

export type InputVariant = FieldSurface;

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  variant?: InputVariant;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

const variantClasses: Record<InputVariant, string> = {
  light: 'placeholder:text-muted',
  dark: 'placeholder:text-white/45',
};

function createNumberChangeEvent(
  event: ChangeEvent<HTMLInputElement>,
  rawValue: string,
): ChangeEvent<HTMLInputElement> {
  return {
    ...event,
    target: { ...event.target, value: rawValue },
    currentTarget: { ...event.currentTarget, value: rawValue },
  };
}

export function Input({
  label,
  error,
  variant,
  prefix,
  suffix,
  className,
  id,
  disabled,
  type,
  value,
  defaultValue,
  onChange,
  ...props
}: InputProps) {
  const theme = useThemeOptional();
  const resolvedVariant = variant ?? (theme?.resolvedTheme === 'dark' ? 'dark' : 'light');
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isPassword = type === 'password';
  const isNumber = type === 'number';
  const [visible, setVisible] = useState(false);
  const [uncontrolledNumberDisplay, setUncontrolledNumberDisplay] = useState(() =>
    isNumber ? numberInputDisplayValue(defaultValue) : '',
  );

  useEffect(() => {
    if (!isPassword) {
      setVisible(false);
    }
  }, [isPassword]);

  const passwordToggle = isPassword ? (
    <button
      type="button"
      tabIndex={-1}
      disabled={disabled}
      aria-label={visible ? 'Hide password' : 'Show password'}
      aria-pressed={visible}
      onClick={() => setVisible((current) => !current)}
      className="inline-flex cursor-pointer items-center text-muted transition-colors hover:cursor-pointer hover:text-foreground disabled:cursor-not-allowed disabled:hover:cursor-not-allowed disabled:opacity-50"
    >
      {visible ? (
        <EyeSlash size={16} variant="Linear" aria-hidden />
      ) : (
        <Eye size={16} variant="Linear" aria-hidden />
      )}
    </button>
  ) : null;

  const resolvedSuffix =
    suffix || passwordToggle ? (
      <span className="inline-flex items-center gap-1.5">
        {suffix}
        {passwordToggle}
      </span>
    ) : undefined;

  const numberDisplayValue =
    isNumber && value !== undefined
      ? numberInputDisplayValue(value)
      : isNumber
        ? uncontrolledNumberDisplay
        : undefined;

  function handleNumberChange(event: ChangeEvent<HTMLInputElement>) {
    const sanitized = sanitizeNumberInput(event.target.value);
    const formatted = formatNumberInput(sanitized);

    if (value === undefined) {
      setUncontrolledNumberDisplay(formatted);
    }

    onChange?.(createNumberChangeEvent(event, sanitized));
  }

  const inputType = isPassword ? (visible ? 'text' : 'password') : isNumber ? 'text' : type;

  return (
    <div className="flex flex-col gap-1">
      {label && inputId ? (
        <label htmlFor={inputId} className={formFieldLabelClass}>
          {label}
        </label>
      ) : null}
      <FieldControl
        variant={resolvedVariant}
        error={!!error}
        disabled={disabled}
        prefix={prefix}
        suffix={resolvedSuffix}
      >
        <input
          id={inputId}
          disabled={disabled}
          type={inputType}
          inputMode={isNumber ? 'decimal' : props.inputMode}
          className={cn(
            'w-full border-0 bg-transparent px-3 py-2 text-open-regular-p outline-none',
            variantClasses[resolvedVariant],
            isNumber && 'instollar-number-input',
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          {...props}
          {...(isNumber
            ? {
                value: numberDisplayValue,
                onChange: handleNumberChange,
                defaultValue: undefined,
              }
            : {
                value,
                defaultValue,
                onChange,
              })}
        />
      </FieldControl>
      {error ? (
        <p id={inputId ? `${inputId}-error` : undefined} role="alert" className={formFieldErrorClass}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
