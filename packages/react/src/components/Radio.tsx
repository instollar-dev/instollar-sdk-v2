import {
  createContext,
  useContext,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { useThemeOptional } from '../theme/ThemeProvider';
import { cn } from '../utils/cn';
import type { FieldSurface } from './formVariants';
import {
  formFieldDescriptionClass,
  formFieldErrorClass,
  formFieldLabelClass,
} from './formVariants';

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant: FieldSurface;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps {
  label?: string;
  description?: string;
  error?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: FieldSurface;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export function RadioGroup({
  label,
  description,
  error,
  name: nameProp,
  value,
  defaultValue,
  onValueChange,
  variant,
  disabled,
  className,
  children,
}: RadioGroupProps) {
  const theme = useThemeOptional();
  const resolvedVariant = variant ?? (theme?.resolvedTheme === 'dark' ? 'dark' : 'light');
  const generatedName = useId();
  const name = nameProp ?? generatedName;
  const groupId = useId();

  return (
    <RadioGroupContext.Provider
      value={{
        name,
        value: value ?? defaultValue,
        onValueChange,
        variant: resolvedVariant,
        disabled,
      }}
    >
      <fieldset
        className={cn('m-0 flex flex-col gap-2 border-0 p-0', className)}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${groupId}-error` : description ? `${groupId}-desc` : undefined
        }
      >
        {label ? (
          <legend className={cn(formFieldLabelClass, 'mb-0.5 px-0')}>{label}</legend>
        ) : null}
        {description ? (
          <p id={`${groupId}-desc`} className={formFieldDescriptionClass}>
            {description}
          </p>
        ) : null}
        <div className="flex flex-col gap-2">{children}</div>
        {error ? (
          <p id={`${groupId}-error`} role="alert" className={formFieldErrorClass}>
            {error}
          </p>
        ) : null}
      </fieldset>
    </RadioGroupContext.Provider>
  );
}

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'name'> {
  value: string;
  label?: ReactNode;
  description?: string;
  variant?: FieldSurface;
}

export function Radio({
  value,
  label,
  description,
  variant,
  className,
  id,
  disabled,
  checked: checkedProp,
  onChange,
  ...props
}: RadioProps) {
  const ctx = useContext(RadioGroupContext);
  const theme = useThemeOptional();
  const resolvedVariant =
    variant ?? ctx?.variant ?? (theme?.resolvedTheme === 'dark' ? 'dark' : 'light');
  const inputId = id ?? `${ctx?.name ?? 'radio'}-${value}`;
  const isDisabled = disabled ?? ctx?.disabled;
  const isChecked = checkedProp ?? (ctx?.value !== undefined ? ctx.value === value : undefined);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    if (event.target.checked) {
      ctx?.onValueChange?.(value);
    }
  };

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'group inline-flex items-start gap-2.5',
        isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      )}
    >
      <span className="relative mt-0.5 shrink-0">
        <input
          type="radio"
          id={inputId}
          name={ctx?.name}
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          onChange={handleChange}
          className="peer sr-only"
          {...props}
        />
        <span
          className={cn(
            'flex size-4 items-center justify-center rounded-full border-2 transition-colors duration-150 outline-none',
            'peer-checked:border-primary',
            '[&>span]:opacity-0 peer-checked:[&>span]:opacity-100',
            'peer-disabled:opacity-50',
            resolvedVariant === 'light'
              ? 'border-border bg-white'
              : 'border-white/14 bg-primary/35',
          )}
        >
          <span className="size-2 rounded-full bg-primary transition-opacity" />
        </span>
      </span>
      {(label || description) && (
        <span className="flex min-w-0 flex-col gap-0.5">
          {label ? <span className={cn(formFieldLabelClass, 'font-medium')}>{label}</span> : null}
          {description ? <span className={formFieldDescriptionClass}>{description}</span> : null}
        </span>
      )}
    </label>
  );
}
