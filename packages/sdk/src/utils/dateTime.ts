import {
  format,
  formatDistanceToNow,
  isToday,
  isValid,
  isYesterday,
  parseISO,
} from 'date-fns';

export type DateTimeInput = Date | string | number;

export function toDate(input: DateTimeInput): Date {
  if (input instanceof Date) return input;
  if (typeof input === 'number') return new Date(input);
  if (typeof input === 'string') {
    const parsed = parseISO(input);
    return isValid(parsed) ? parsed : new Date(Number.NaN);
  }
  return new Date(Number.NaN);
}

export function toDateInputValue(input: DateTimeInput | null | undefined): string {
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
  input: DateTimeInput,
  formatStr: string = dateTimeFormats.display,
): string {
  const date = toDate(input);
  return isValid(date) ? format(date, formatStr) : '';
}

export function formatTime(input: DateTimeInput, use24h = false): string {
  const date = toDate(input);
  return isValid(date)
    ? format(date, use24h ? dateTimeFormats.time24 : dateTimeFormats.time12)
    : '';
}

export function formatDateTime(
  input: DateTimeInput,
  formatStr: string = dateTimeFormats.dateTimeShort,
): string {
  const date = toDate(input);
  return isValid(date) ? format(date, formatStr) : '';
}

export function formatRelative(input: DateTimeInput): string {
  const date = toDate(input);
  return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : '';
}

export function formatDateSmart(
  input: DateTimeInput,
  formatStr: string = dateTimeFormats.short,
): string {
  const date = toDate(input);
  if (!isValid(date)) return '';
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, formatStr);
}

export function formatISO(input: DateTimeInput): string {
  const date = toDate(input);
  return isValid(date) ? date.toISOString() : '';
}

export function formatDateOnly(input: DateTimeInput): string {
  const date = toDate(input);
  return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
}
