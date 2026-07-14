import { Add, ArrowDown2, Refresh, SearchNormal1, TickCircle, TickSquare, Warning2 } from 'iconsax-react';
import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useClickOutside } from '../hooks/useClickOutside';
import { useFloatingPosition } from '../hooks/useFloatingPosition';
import { cn } from '../utils/cn';
import { Button } from './Button';
import { FieldControl } from './FieldControl';
import type { FieldSurface } from './formVariants';
import { formFieldErrorClass, formFieldLabelClass } from './formVariants';
import { Spinner } from './Spinner';
import {
  defaultCompareValue,
  defaultCreateOptionLabel,
  defaultFormatCreateValue,
  defaultGetOptionKey,
  defaultGetOptionLabel,
  defaultIsValidCreateInput,
  defaultNormalizeCreateInput,
  deriveCustomOptionsFromSelection,
  findOptionByInput,
  getSelectDisplayLabel,
  isOptionSelected,
  mergeSelectOptions,
  type SelectOption,
} from './selectUtils';

export type { SelectOption };
export type SelectVariant = FieldSurface;
export { selectOptionsPropsFromQuery } from './selectUtils';

const PORTAL_ROOT_ID = 'instollar-select-portal-root';

function getPortalRoot(): HTMLElement {
  if (typeof document === 'undefined') {
    return null as unknown as HTMLElement;
  }
  let root = document.getElementById(PORTAL_ROOT_ID);
  if (!root) {
    root = document.createElement('div');
    root.id = PORTAL_ROOT_ID;
    root.setAttribute('data-instollar-portal', 'select');
    document.body.appendChild(root);
  }
  return root;
}

export interface SelectProps<T = string> {
  label?: string;
  /** Form validation error */
  error?: string;
  /** API/options fetch failure message */
  optionsError?: string;
  /** Options list is loading (e.g. from an API) */
  optionsLoading?: boolean;
  optionsLoadingLabel?: string;
  optionsErrorLabel?: string;
  onReloadOptions?: () => void;
  reloadLabel?: string;
  variant?: SelectVariant;
  options: SelectOption<T>[];
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  /** Allow typing a value that is not in `options` — adds it to the list and selects it */
  creatable?: boolean;
  createOptionLabel?: (input: string) => string;
  formatCreateValue?: (input: string) => T;
  getOptionLabel?: (value: T) => string;
  normalizeCreateInput?: (input: string) => string;
  isValidCreateInput?: (input: string) => boolean;
  onCreateOption?: (input: string) => T;
  customInputPlaceholder?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  value?: T | T[];
  defaultValue?: T | T[];
  onValueChange?: (value: T | T[]) => void;
  compareValue?: (a: T, b: T) => boolean;
  getOptionKey?: (value: T) => string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

function SelectOptionsLoading({ message }: { message: string }) {
  return (
    <li className="flex flex-col items-center justify-center gap-3 px-4 py-8 text-center">
      <Spinner size={20} className="text-primary" />
      <span className="text-open-regular-p text-muted">{message}</span>
    </li>
  );
}

function SelectOptionsError({
  message,
  reloadLabel,
  onReload,
}: {
  message: string;
  reloadLabel: string;
  onReload?: () => void;
}) {
  return (
    <li className="flex flex-col items-center justify-center gap-3 px-4 py-6 text-center">
      <span
        className="flex size-10 items-center justify-center rounded-full bg-(--destructive-muted) text-destructive"
        aria-hidden
      >
        <Warning2 size={22} variant="TwoTone" />
      </span>
      <p className="max-w-[16rem] text-open-regular-p text-foreground">{message}</p>
      {onReload ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          prefix={<Refresh size={14} aria-hidden />}
          onClick={onReload}
        >
          {reloadLabel}
        </Button>
      ) : null}
    </li>
  );
}

export function Select<T = string>({
  label,
  error,
  optionsError,
  optionsLoading = false,
  optionsLoadingLabel = 'Loading options…',
  optionsErrorLabel = "Couldn't load options",
  onReloadOptions,
  reloadLabel = 'Try again',
  variant,
  options,
  placeholder,
  multiple = false,
  searchable = false,
  creatable = false,
  createOptionLabel = defaultCreateOptionLabel,
  formatCreateValue = defaultFormatCreateValue as (input: string) => T,
  getOptionLabel = defaultGetOptionLabel as (value: T) => string,
  normalizeCreateInput = defaultNormalizeCreateInput,
  isValidCreateInput = defaultIsValidCreateInput,
  onCreateOption,
  customInputPlaceholder = 'Add custom…',
  prefix,
  suffix,
  value,
  defaultValue,
  onValueChange,
  compareValue = defaultCompareValue,
  getOptionKey = defaultGetOptionKey,
  disabled,
  className,
  id,
}: SelectProps<T>) {
  const resolvedVariant = variant ?? 'light';
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [internalValue, setInternalValue] = useState<T | T[] | undefined>(defaultValue);
  const [customOptions, setCustomOptions] = useState<SelectOption<T>[]>([]);

  const dropdownMaxHeight = searchable || creatable ? 264 : 224;
  const position = useFloatingPosition(anchorRef, open, dropdownMaxHeight);

  const selected = value ?? internalValue;

  const derivedCustomOptions = useMemo(
    () =>
      deriveCustomOptionsFromSelection(
        options,
        selected,
        multiple,
        compareValue,
        getOptionLabel,
      ),
    [options, selected, multiple, compareValue, getOptionLabel],
  );

  const allOptions = useMemo(
    () => mergeSelectOptions(options, [...customOptions, ...derivedCustomOptions], compareValue),
    [options, customOptions, derivedCustomOptions, compareValue],
  );

  const displayLabel = optionsLoading
    ? optionsLoadingLabel
    : optionsError
      ? optionsErrorLabel
      : getSelectDisplayLabel(
          allOptions,
          selected,
          multiple,
          placeholder,
          compareValue,
          getOptionLabel,
        );

  const filteredOptions = useMemo(() => {
    if (!searchable || !search.trim()) return allOptions;
    const query = search.trim().toLowerCase();
    return allOptions.filter((option) => option.label.toLowerCase().includes(query));
  }, [allOptions, searchable, search]);

  const createInputValue = searchable ? search : customInput;
  const normalizedCreateInput = normalizeCreateInput(createInputValue);
  const showCreateOption =
    creatable &&
    !optionsLoading &&
    !optionsError &&
    isValidCreateInput(normalizedCreateInput) &&
    !findOptionByInput(allOptions, normalizedCreateInput, getOptionLabel);

  const showCustomInputFooter = creatable && !searchable && !optionsLoading && !optionsError;
  const dropdownChromeHeight =
    (searchable && !optionsLoading && !optionsError ? 40 : 0) +
    (showCustomInputFooter ? 44 : 0);

  const toggleOpen = useCallback(() => {
    if (disabled || optionsLoading) return;
    setOpen((current) => !current);
    if (open) {
      setSearch('');
      setCustomInput('');
    }
  }, [disabled, open, optionsLoading]);

  const close = useCallback(() => {
    setOpen(false);
    setSearch('');
    setCustomInput('');
  }, []);

  useClickOutside([rootRef, portalRef], close, open);

  const commitValue = (next: T | T[]) => {
    if (value === undefined) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  };

  const addCustomValue = useCallback(
    (rawInput: string) => {
      if (!creatable || disabled || optionsLoading || optionsError) return;

      const input = normalizeCreateInput(rawInput);
      if (!isValidCreateInput(input)) return;

      const existing = findOptionByInput(allOptions, input, getOptionLabel);
      if (existing) {
        if (multiple) {
          const current = Array.isArray(selected) ? selected : [];
          const exists = current.some((item) => compareValue(item, existing.value));
          const next = exists
            ? current.filter((item) => !compareValue(item, existing.value))
            : [...current, existing.value];
          commitValue(next);
        } else {
          commitValue(existing.value);
          close();
        }
        setSearch('');
        setCustomInput('');
        return;
      }

      const newValue = onCreateOption?.(input) ?? formatCreateValue(input);
      const newOption: SelectOption<T> = { value: newValue, label: input };

      setCustomOptions((current) => {
        if (current.some((option) => compareValue(option.value, newValue))) {
          return current;
        }
        return [...current, newOption];
      });

      if (multiple) {
        const current = Array.isArray(selected) ? selected : [];
        if (!current.some((item) => compareValue(item, newValue))) {
          commitValue([...current, newValue]);
        }
      } else {
        commitValue(newValue);
        close();
      }

      setSearch('');
      setCustomInput('');
    },
    [
      allOptions,
      close,
      compareValue,
      creatable,
      disabled,
      formatCreateValue,
      getOptionLabel,
      isValidCreateInput,
      multiple,
      normalizeCreateInput,
      onCreateOption,
      optionsError,
      optionsLoading,
      selected,
      onValueChange,
      value,
    ],
  );

  const toggleOption = (option: SelectOption<T>) => {
    if (option.disabled || disabled || optionsLoading || optionsError) return;

    if (multiple) {
      const current = Array.isArray(selected) ? selected : [];
      const exists = current.some((item) => compareValue(item, option.value));
      const next = exists
        ? current.filter((item) => !compareValue(item, option.value))
        : [...current, option.value];
      commitValue(next);
      return;
    }

    commitValue(option.value);
    close();
  };

  const hasSelection =
    !optionsLoading &&
    !optionsError &&
    (multiple
      ? Array.isArray(selected) && selected.length > 0
      : selected !== undefined && !Array.isArray(selected));

  const fieldError = !!error || !!optionsError;
  const describedBy = [
    error ? `${selectId}-error` : null,
    optionsError ? `${selectId}-options-error` : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  const dropdownStyle: CSSProperties | undefined = position
    ? {
        position: 'fixed',
        left: position.left,
        width: position.width,
        zIndex: 2147483646,
        ...(position.placement === 'bottom'
          ? { top: position.top, bottom: 'auto' }
          : { bottom: position.bottom, top: 'auto' }),
      }
    : undefined;

  const dropdown =
    open && position ? (
      <div
        ref={portalRef}
        role="presentation"
        style={dropdownStyle}
        className={cn(
          'overflow-hidden rounded-lg border shadow-lg',
          resolvedVariant === 'light'
            ? 'border-border bg-white'
            : 'border-white/14 bg-primary',
        )}
      >
        {searchable && !optionsLoading && !optionsError && (
          <div
            className={cn(
              'flex items-center gap-2 border-b px-3 py-2',
              resolvedVariant === 'light' ? 'border-border' : 'border-white/14',
            )}
          >
            <SearchNormal1 size={16} className="shrink-0 text-muted" aria-hidden />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && creatable && showCreateOption) {
                  event.preventDefault();
                  addCustomValue(search);
                }
              }}
              placeholder={creatable ? 'Search or add…' : 'Search…'}
              className={cn(
                'w-full bg-transparent text-open-regular-p outline-none placeholder:text-muted',
                resolvedVariant === 'dark' && 'text-white',
              )}
              autoFocus
            />
          </div>
        )}

        <ul
          id={listboxId}
          role="listbox"
          aria-multiselectable={multiple || undefined}
          aria-busy={optionsLoading || undefined}
          className="overflow-y-auto py-1"
          style={{ maxHeight: position.maxHeight - dropdownChromeHeight }}
        >
          {optionsLoading ? (
            <SelectOptionsLoading message={optionsLoadingLabel} />
          ) : optionsError ? (
            <SelectOptionsError
              message={optionsError}
              reloadLabel={reloadLabel}
              onReload={() => {
                onReloadOptions?.();
              }}
            />
          ) : (
            <>
              {showCreateOption && (
                <li role="option" aria-selected={false}>
                  <button
                    type="button"
                    onClick={() => addCustomValue(normalizedCreateInput)}
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-open-regular-p outline-none transition-colors duration-150',
                      'text-primary hover:cursor-pointer hover:bg-primary/14',
                    )}
                  >
                    <Add size={16} className="shrink-0" aria-hidden />
                    <span className="min-w-0 flex-1 truncate">
                      {createOptionLabel(normalizedCreateInput)}
                    </span>
                  </button>
                </li>
              )}
              {filteredOptions.length === 0 && !showCreateOption ? (
                <li className="px-3 py-2 text-open-regular-p text-muted">No options found</li>
              ) : (
                filteredOptions.map((option) => {
                  const selectedOption = isOptionSelected(option, selected, multiple, compareValue);
                  return (
                    <li key={getOptionKey(option.value)} role="option" aria-selected={selectedOption}>
                      <button
                        type="button"
                        disabled={option.disabled}
                        onClick={() => toggleOption(option)}
                        className={cn(
                          'flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-open-regular-p outline-none transition-colors duration-150',
                          'hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
                          selectedOption
                            ? 'bg-primary/14 text-foreground'
                            : 'text-foreground hover:bg-primary/5',
                          resolvedVariant === 'dark' && 'text-white',
                        )}
                      >
                        {multiple && (
                          <span
                            className={cn(
                              'flex size-4 shrink-0 items-center justify-center rounded border',
                              selectedOption
                                ? 'border-primary bg-primary'
                                : resolvedVariant === 'light'
                                  ? 'border-border bg-white'
                                  : 'border-white/14 bg-transparent',
                            )}
                          >
                            {selectedOption && (
                              <TickSquare size={12} variant="Bold" className="text-white" />
                            )}
                          </span>
                        )}
                        {option.prefix ? (
                          <span className="flex shrink-0 items-center text-muted [&>svg]:size-4">
                            {option.prefix}
                          </span>
                        ) : null}
                        <span className="min-w-0 flex-1 truncate">{option.label}</span>
                        {option.suffix ? (
                          <span className="flex shrink-0 items-center text-muted [&>svg]:size-4">
                            {option.suffix}
                          </span>
                        ) : null}
                        {!multiple && selectedOption && (
                          <TickCircle
                            size={16}
                            variant="Bold"
                            className="shrink-0 text-primary"
                            aria-hidden
                          />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </>
          )}
        </ul>

        {showCustomInputFooter && (
          <div
            className={cn(
              'flex items-center gap-2 border-t px-3 py-2',
              resolvedVariant === 'light' ? 'border-border' : 'border-white/14',
            )}
          >
            <input
              type="text"
              value={customInput}
              onChange={(event) => setCustomInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addCustomValue(customInput);
                }
              }}
              placeholder={customInputPlaceholder}
              className={cn(
                'min-w-0 flex-1 bg-transparent text-open-regular-p outline-none placeholder:text-muted',
                resolvedVariant === 'dark' && 'text-white',
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!showCreateOption}
              prefix={<Add size={14} aria-hidden />}
              onClick={() => addCustomValue(customInput)}
            >
              Add
            </Button>
          </div>
        )}
      </div>
    ) : null;

  return (
    <div ref={rootRef} className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label
          id={`${selectId}-label`}
          htmlFor={selectId}
          className={cn(
            formFieldLabelClass,
            disabled || optionsLoading ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          {label}
        </label>
      )}

      <FieldControl
        ref={anchorRef}
        variant={resolvedVariant}
        error={fieldError}
        disabled={disabled || optionsLoading}
        prefix={prefix}
      >
        <button
          id={selectId}
          type="button"
          disabled={disabled || optionsLoading}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-busy={optionsLoading || undefined}
          aria-labelledby={label ? `${selectId}-label` : undefined}
          aria-controls={listboxId}
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={describedBy}
          onClick={toggleOpen}
          className={cn(
            'flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-open-regular-p outline-none',
            'hover:cursor-pointer disabled:cursor-not-allowed',
            !hasSelection && 'text-muted',
            optionsError && !optionsLoading && 'text-destructive',
          )}
        >
          <span className="min-w-0 flex-1 truncate">{displayLabel}</span>
          <span className="flex shrink-0 items-center gap-1.5 text-muted">
            {suffix}
            {optionsLoading ? (
              <Spinner size={16} className="text-primary" />
            ) : optionsError ? (
              <Warning2 size={16} className="text-destructive" aria-hidden />
            ) : (
              <ArrowDown2
                size={16}
                variant="Linear"
                className={cn('shrink-0 transition-transform duration-200', open && 'rotate-180')}
                aria-hidden
              />
            )}
          </span>
        </button>
      </FieldControl>

      {typeof document !== 'undefined' && dropdown
        ? createPortal(dropdown, getPortalRoot())
        : null}

      {error && (
        <p id={`${selectId}-error`} role="alert" className={formFieldErrorClass}>
          {error}
        </p>
      )}

      {optionsError && !error && (
        <p
          id={`${selectId}-options-error`}
          role="alert"
          className={cn(formFieldErrorClass, 'flex flex-wrap items-center gap-x-2 gap-y-1')}
        >
          <span className="min-w-0 flex-1">{optionsError}</span>
          {onReloadOptions ? (
            <button
              type="button"
              onClick={onReloadOptions}
              className="inline-flex shrink-0 items-center gap-1 font-semibold text-destructive underline-offset-2 hover:underline"
            >
              <Refresh size={12} aria-hidden />
              {reloadLabel}
            </button>
          ) : null}
        </p>
      )}
    </div>
  );
}
