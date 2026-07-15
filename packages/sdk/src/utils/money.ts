export const NO_CURRENCY_LABEL = 'No Currency';

export interface MoneyFormatOptions {
  currency?: string;
  locale?: string;
  useShorthand?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export type ProjectAmountFields = {
  projectAmount?: number | string | null;
  amount?: number | string | null;
  boqTotalAmount?: number | string | null;
};

export function formatCompactAmount(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return String(num);
}

export function formatMoney(
  amount: number | string,
  options: MoneyFormatOptions = {},
): string {
  const {
    currency = 'NGN',
    locale = 'en-NG',
    useShorthand = false,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = options;
  const numericAmount = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
  if (Number.isNaN(numericAmount)) return String(amount);

  if (useShorthand) {
    const symbol = new Intl.NumberFormat(locale, { style: 'currency', currency })
      .formatToParts(0)
      .find((part) => part.type === 'currency')?.value;
    return `${symbol ?? currency}${formatCompactAmount(numericAmount)}`;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numericAmount);
}

export function formatCurrencyLabel(
  amount?: number,
  currency?: string | null,
): string {
  if (!currency?.trim()) return NO_CURRENCY_LABEL;
  if (amount == null || !Number.isFinite(amount)) return '—';
  return `${currency.trim()} ${amount.toLocaleString()}`;
}

/** @deprecated Use formatMoney. For profile-style labels, use formatCurrencyLabel. */
export const formatCurrency = formatMoney;

/** @deprecated Use formatCompactAmount. */
export const formatAmount = formatCompactAmount;

export function parseProjectAmount(
  value: number | string | null | undefined,
): number | null {
  if (value == null || value === '') return null;
  const numberValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

export function resolveProjectDisplayAmountOrNull(
  fields: ProjectAmountFields,
): number | null {
  const projectAmount = parseProjectAmount(fields.projectAmount);
  if (projectAmount != null) return projectAmount;
  const amount = parseProjectAmount(fields.amount);
  if (amount != null) return amount;
  return parseProjectAmount(fields.boqTotalAmount);
}

export function resolveProjectDisplayAmount(
  fields: ProjectAmountFields,
  fallback = 0,
): number {
  return resolveProjectDisplayAmountOrNull(fields) ?? fallback;
}
