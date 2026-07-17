import { Calendar, Clock } from 'iconsax-react';
import {
  useId,
  useRef,
  type ChangeEvent,
  type FC,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { iconPaint } from '../utils/iconPaint';

export type DateInputType = 'date' | 'time' | 'datetime-local';

export interface DateInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'onChange' | 'prefix' | 'suffix'
  > {
  type?: DateInputType;
  value?: string | Date | number | null;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  labelAdornment?: ReactNode;
  error?: string;
  showErrorMessage?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  variant?: 'default' | 'inline';
  icon?: ReactNode;
  rightElement?: ReactNode;
}

export type TimeInputProps = Omit<DateInputProps, 'type'>;
export type DateTimeInputProps = Omit<DateInputProps, 'type'>;

/** Local YMD coerce — matches SDK `toDateInputValue` for form fields without pulling date-fns into react. */
function toDateInputValue(input: string | Date | number | null | undefined): string {
  if (input == null || input === '') return '';
  if (typeof input === 'string') {
    if (/^\d{4}-\d{2}-\d{2}/.test(input)) return input.slice(0, 10);
    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) return '';
    return formatLocalYmd(parsed);
  }
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return '';
  return formatLocalYmd(date);
}

function formatLocalYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Local `YYYY-MM-DDTHH:mm` for `<input type="datetime-local">`. */
function toDateTimeLocalValue(input: string | Date | number | null | undefined): string {
  if (input == null || input === '') return '';
  if (typeof input === 'string') {
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(input)) return input.slice(0, 16);
    if (/^\d{4}-\d{2}-\d{2}/.test(input) && !input.includes('T')) return `${input.slice(0, 10)}T00:00`;
    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) return '';
    return formatLocalDateTime(parsed);
  }
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return '';
  return formatLocalDateTime(date);
}

function formatLocalDateTime(date: Date): string {
  return `${formatLocalYmd(date)}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

function resolveDisplayValue(
  type: DateInputType,
  value: string | Date | number | null | undefined,
): string {
  if (type === 'date') {
    return typeof value === 'string' ? value : toDateInputValue(value ?? undefined);
  }
  if (type === 'datetime-local') {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)
      ? value.slice(0, 16)
      : toDateTimeLocalValue(value ?? undefined);
  }
  return (value as string | null | undefined) ?? '';
}

export const DateInput: FC<DateInputProps> = ({
  type = 'date',
  value,
  onChange,
  label,
  labelAdornment,
  error,
  showErrorMessage = true,
  className,
  inputClassName,
  labelClassName,
  variant = 'default',
  icon,
  rightElement,
  disabled,
  onFocus,
  id: idProp,
  ...rest
}) => {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  const isControlled = value !== undefined;
  const displayValue = resolveDisplayValue(type, value);

  const openPicker = () => {
    const el = inputRef.current;
    if (!el) return;
    try {
      el.showPicker?.();
    } catch {
      el.focus();
    }
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    onFocus?.(event);
    try {
      event.currentTarget.showPicker?.();
    } catch {
      // unsupported / no user gesture
    }
  };

  const defaultClasses =
    variant === 'inline'
      ? 'w-full rounded bg-transparent px-2 py-1 text-spline-regular-p text-foreground focus:outline-none'
      : cn(
          'w-full rounded-[4px] border-[0.5px] bg-background px-4 py-3 text-foreground transition-shadow',
          'focus:outline-none focus:ring-1 focus:ring-primary',
          'disabled:cursor-not-allowed disabled:border-border/50 disabled:bg-foreground/5 disabled:text-muted',
          error ? 'border-destructive focus:ring-destructive' : 'border-border',
          'pr-13',
        );

  const webkitPicker =
    '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0';

  const pickerLabel =
    type === 'time' ? 'Choose time' : type === 'datetime-local' ? 'Choose date and time' : 'Choose date';

  const defaultIcon =
    type === 'time' ? (
      <Clock size={18} variant="Linear" color={iconPaint.muted} aria-hidden />
    ) : (
      <Calendar size={18} variant="Linear" color={iconPaint.muted} aria-hidden />
    );

  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <div className="mb-1 flex items-center gap-1">
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-normal text-foreground md:text-base',
              labelClassName,
            )}
          >
            {label}
          </label>
          {labelAdornment}
        </div>
      ) : null}

      <div className="relative">
        <input
          {...rest}
          id={inputId}
          ref={inputRef}
          type={type}
          disabled={disabled}
          {...(isControlled ? { value: displayValue } : {})}
          onChange={onChange}
          onFocus={handleFocus}
          className={cn(defaultClasses, webkitPicker, inputClassName)}
        />

        {variant === 'default' && rightElement === undefined ? (
          <button
            type="button"
            className="absolute top-1/2 right-3 z-10 -translate-y-1/2 text-muted hover:text-foreground focus:outline-none"
            aria-label={pickerLabel}
            onClick={openPicker}
            disabled={disabled}
          >
            {icon ?? defaultIcon}
          </button>
        ) : null}

        {variant === 'default' && rightElement !== undefined ? (
          <div className="absolute top-1/2 right-1 z-10 -translate-y-1/2">{rightElement}</div>
        ) : null}
      </div>

      {showErrorMessage && error ? (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      ) : null}
    </div>
  );
};

export const TimeInput: FC<TimeInputProps> = (props) => <DateInput type="time" {...props} />;

export const DateTimeInput: FC<DateTimeInputProps> = (props) => (
  <DateInput type="datetime-local" {...props} />
);

export default DateInput;
