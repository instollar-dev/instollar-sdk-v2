/** Strip grouping commas and non-numeric characters; keep at most one decimal point. */
export function sanitizeNumberInput(value: string): string {
  const cleaned = value.replace(/,/g, '').replace(/[^\d.]/g, '');
  if (!cleaned) return '';

  const dotIndex = cleaned.indexOf('.');
  if (dotIndex === -1) return cleaned;

  const intPart = cleaned.slice(0, dotIndex);
  const decPart = cleaned.slice(dotIndex + 1).replace(/\./g, '');
  return decPart.length > 0 ? `${intPart}.${decPart}` : `${intPart}.`;
}

/** Format a numeric string with thousands separators as the user types. */
export function formatNumberInput(value: string): string {
  const sanitized = sanitizeNumberInput(value);
  if (!sanitized) return '';

  const endsWithDot = sanitized.endsWith('.');
  const [intPart = '', decPart] = sanitized.split('.');

  if (!intPart && !decPart) return endsWithDot ? '.' : '';

  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (sanitized.includes('.')) {
    return endsWithDot && decPart === '' ? `${formattedInt}.` : `${formattedInt}.${decPart}`;
  }

  return formattedInt;
}

export function numberInputDisplayValue(
  value: string | number | readonly string[] | undefined,
): string {
  if (value === undefined || value === null || value === '') return '';
  const raw = Array.isArray(value) ? value.join('') : String(value);
  return formatNumberInput(raw);
}

export function numberInputRawValue(
  value: string | number | readonly string[] | undefined,
): string {
  if (value === undefined || value === null || value === '') return '';
  const raw = Array.isArray(value) ? value.join('') : String(value);
  return sanitizeNumberInput(raw.replace(/,/g, ''));
}
