export function formatNumberWithGrouping(
  value: number | string | null | undefined,
): string {
  if (value === '' || value == null) return '';
  const numberValue =
    typeof value === 'number'
      ? value
      : Number.parseFloat(String(value).replace(/,/g, '').trim());
  if (!Number.isFinite(numberValue)) return typeof value === 'string' ? value : '';
  return new Intl.NumberFormat('en-NG', { maximumFractionDigits: 20 }).format(numberValue);
}

export function formatAsTyping(raw: string): string {
  const normalized = raw.replace(/,/g, '');
  if (normalized === '') return '';
  if (normalized === '-' || normalized === '.' || normalized === '-.') return normalized;

  const hasTrailingDecimal = normalized.endsWith('.');
  const body = hasTrailingDecimal ? normalized.slice(0, -1) : normalized;
  if (body === '' || body === '-') return normalized;

  const numberValue = Number.parseFloat(body);
  if (!Number.isFinite(numberValue)) return normalized;
  const formatted = new Intl.NumberFormat('en-NG', {
    maximumFractionDigits: 20,
  }).format(numberValue);
  return hasTrailingDecimal ? `${formatted}.` : formatted;
}

/**
 * Formats amount inputs using en-US grouping. This intentionally differs from
 * formatNumberWithGrouping (en-NG) to preserve existing input behavior.
 */
export function formatAmountInput(value: string): string {
  if (!value) return '';
  const numericValue = value.replace(/[^0-9.]/g, '');
  if (!numericValue) return '';
  const parts = numericValue.split('.');
  const wholePart = parts[0] ?? '';
  const decimalPart = parts.length > 1 ? `.${parts[1]}` : '';
  const parsedWhole = Number.parseInt(wholePart, 10);
  const formattedWhole = Number.isNaN(parsedWhole)
    ? ''
    : parsedWhole.toLocaleString('en-US');
  return formattedWhole + decimalPart;
}

export function parseAmountInput(value: string): number {
  if (!value) return 0;
  return Number.parseFloat(value.replace(/,/g, '')) || 0;
}
