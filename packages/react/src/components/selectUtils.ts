import type { ReactNode } from 'react';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export function defaultCompareValue<T>(a: T, b: T): boolean {
  return a === b;
}

export function defaultGetOptionKey<T>(value: T): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return JSON.stringify(value);
}

export function isOptionSelected<T>(
  option: SelectOption<T>,
  selected: T | T[] | undefined,
  multiple: boolean,
  compareValue: (a: T, b: T) => boolean,
): boolean {
  if (selected === undefined) return false;
  if (multiple) {
    return Array.isArray(selected) && selected.some((item) => compareValue(item, option.value));
  }
  return !Array.isArray(selected) && compareValue(selected, option.value);
}

export function defaultGetOptionLabel<T>(value: T): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

export function defaultFormatCreateValue(input: string): string {
  return input;
}

export function defaultNormalizeCreateInput(input: string): string {
  return input.trim();
}

export function defaultIsValidCreateInput(input: string): boolean {
  return input.trim().length > 0;
}

export function defaultCreateOptionLabel(input: string): string {
  return `Add "${input}"`;
}

export function findOptionByInput<T>(
  options: SelectOption<T>[],
  input: string,
  getOptionLabel: (value: T) => string,
): SelectOption<T> | undefined {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return undefined;

  return options.find((option) => {
    if (option.label.trim().toLowerCase() === normalized) return true;
    return getOptionLabel(option.value).trim().toLowerCase() === normalized;
  });
}

export function mergeSelectOptions<T>(
  options: SelectOption<T>[],
  extraOptions: SelectOption<T>[],
  compareValue: (a: T, b: T) => boolean,
): SelectOption<T>[] {
  const merged = [...options];

  for (const option of extraOptions) {
    if (!merged.some((item) => compareValue(item.value, option.value))) {
      merged.push(option);
    }
  }

  return merged;
}

export function getSelectedValues<T>(
  selected: T | T[] | undefined,
  multiple: boolean,
): T[] {
  if (selected === undefined) return [];
  if (multiple) return Array.isArray(selected) ? selected : [];
  return Array.isArray(selected) ? [] : [selected];
}

export function deriveCustomOptionsFromSelection<T>(
  options: SelectOption<T>[],
  selected: T | T[] | undefined,
  multiple: boolean,
  compareValue: (a: T, b: T) => boolean,
  getOptionLabel: (value: T) => string,
): SelectOption<T>[] {
  return getSelectedValues(selected, multiple)
    .filter((value) => !options.some((option) => compareValue(option.value, value)))
    .map((value) => ({
      value,
      label: getOptionLabel(value),
    }));
}

export function getSelectDisplayLabel<T>(
  options: SelectOption<T>[],
  selected: T | T[] | undefined,
  multiple: boolean,
  placeholder: string | undefined,
  compareValue: (a: T, b: T) => boolean,
  getOptionLabel: (value: T) => string = defaultGetOptionLabel,
): string {
  if (selected === undefined) return placeholder ?? 'Select…';

  if (multiple) {
    const values = Array.isArray(selected) ? selected : [];
    if (values.length === 0) return placeholder ?? 'Select…';
    const labels = values.map(
      (value) =>
        options.find((option) => compareValue(option.value, value))?.label ??
        getOptionLabel(value),
    );
    return labels.length > 0 ? labels.join(', ') : placeholder ?? 'Select…';
  }

  const match = options.find((option) => compareValue(option.value, selected as T));
  return match?.label ?? getOptionLabel(selected as T) ?? placeholder ?? 'Select…';
}

/** Map TanStack Query result flags to `Select` options-loading props. */
export function selectOptionsPropsFromQuery(query: {
  isPending: boolean;
  isError: boolean;
  data: unknown;
  error?: Error | null;
  refetch: () => unknown;
}) {
  return {
    optionsLoading: query.isPending && query.data == null,
    optionsError: query.isError ? (query.error?.message ?? "Couldn't load options") : undefined,
    onReloadOptions: () => {
      void query.refetch();
    },
  } as const;
}
