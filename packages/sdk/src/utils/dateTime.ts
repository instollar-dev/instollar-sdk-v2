import {
  format,
  formatDistanceToNow,
  isToday,
  isValid,
  isYesterday,
  parseISO,
} from 'date-fns';

export type DateLike = Date | string | number;

/** @deprecated Use {@link DateLike}. Renamed so it does not clash with the DateTimeInput component. */
export type DateInputLike = DateLike;

export function toDate(input: DateLike): Date {
  if (input instanceof Date) return input;
  if (typeof input === 'number') return new Date(input);
  if (typeof input === 'string') {
    const parsed = parseISO(input);
    return isValid(parsed) ? parsed : new Date(Number.NaN);
  }
  return new Date(Number.NaN);
}

export function toDateInputValue(input: DateLike | null | undefined): string {
  if (input == null) return '';
  const raw = String(input).trim();
  if (!raw) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const date = toDate(input);
  return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
}

export const dateTimeFormats = {
  display: 'EEE, do MMM, yyyy',
  short: 'dd MMM yyyy',
  numeric: 'dd/MM/yyyy',
  long: 'MMMM d, yyyy',
  time12: 'h:mm a',
  time24: 'HH:mm',
  dateTimeShort: 'dd MMM yyyy, h:mm a',
  dateTimeDisplay: "EEE, do MMM, yyyy 'at' h:mm a",
  iso: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;

export function formatDate(
  input: DateLike,
  formatStr: string = dateTimeFormats.display,
): string {
  const date = toDate(input);
  return isValid(date) ? format(date, formatStr) : '';
}

export function formatTime(input: DateLike, use24h = false): string {
  const date = toDate(input);
  return isValid(date)
    ? format(date, use24h ? dateTimeFormats.time24 : dateTimeFormats.time12)
    : '';
}

export function formatDateTime(
  input: DateLike,
  formatStr: string = dateTimeFormats.dateTimeShort,
): string {
  const date = toDate(input);
  return isValid(date) ? format(date, formatStr) : '';
}

export function formatRelative(input: DateLike): string {
  const date = toDate(input);
  return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : '';
}

export function formatDateSmart(
  input: DateLike,
  formatStr: string = dateTimeFormats.short,
): string {
  const date = toDate(input);
  if (!isValid(date)) return '';
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, formatStr);
}

export function formatISO(input: DateLike): string {
  const date = toDate(input);
  return isValid(date) ? date.toISOString() : '';
}

export function formatDateOnly(input: DateLike): string {
  const date = toDate(input);
  return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
}
