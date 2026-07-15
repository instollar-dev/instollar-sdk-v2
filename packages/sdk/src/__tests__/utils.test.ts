import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import {
  formatAmountInput,
  formatAsTyping,
  formatCompactAmount,
  formatCurrencyLabel,
  formatDate,
  formatDateOnly,
  formatMoney,
  formatNumberWithGrouping,
  formatPhoneForApi,
  getApiErrorMessage,
  isNetworkDisconnectError,
  maskEmailForOtpHint,
  normalizePhoneForApi,
  normalizeString,
  parseAmountInput,
  resolveProjectDisplayAmount,
  toDateInputValue,
  validateForm,
} from '../utils';

describe('date and time helpers', () => {
  it('formats valid dates and safely rejects invalid values', () => {
    expect(toDateInputValue('2025-08-22T12:00:00Z')).toBe('2025-08-22');
    expect(formatDate('2025-08-22', 'dd MMM yyyy')).toBe('22 Aug 2025');
    expect(formatDateOnly('2025-08-22')).toBe('2025-08-22');
    expect(formatDate('not-a-date')).toBe('');
  });
});

describe('money and number helpers', () => {
  it('keeps the two currency behaviors unambiguous', () => {
    expect(formatCurrencyLabel(1000, null)).toBe('No Currency');
    expect(formatCurrencyLabel(1000, 'NGN')).toMatch(/^NGN 1,000$/);
    expect(formatMoney(1500, { currency: 'NGN' })).toMatch(/1,500/);
    expect(formatMoney(1_500_000, { currency: 'NGN', useShorthand: true })).toContain('1.5M');
    expect(formatCompactAmount(1200)).toBe('1.2K');
  });

  it('formats project amounts and numeric input values', () => {
    expect(resolveProjectDisplayAmount({ amount: '2500', boqTotalAmount: 10 })).toBe(2500);
    expect(formatNumberWithGrouping('12345.5')).toBe('12,345.5');
    expect(formatAsTyping('1234.')).toBe('1,234.');
    expect(formatAmountInput('001234.50.9')).toBe('1,234.50');
    expect(parseAmountInput('1,234.50')).toBe(1234.5);
  });
});

describe('string and phone helpers', () => {
  it('normalizes labels, masks emails, and prepares API phone values', () => {
    expect(normalizeString('PENDING_QA')).toBe('Pending Qa');
    expect(maskEmailForOtpHint('john@example.com')).toBe('jo***@example.com');
    expect(
      formatPhoneForApi({ phoneCode: '+234', nationalNumber: '801 234 5678' }),
    ).toBe('2348012345678');
    expect(normalizePhoneForApi('+234+801')).toBe('234801');
  });
});

describe('validation and API error helpers', () => {
  it('returns the first Zod message per field', () => {
    const schema = z.object({
      email: z.string().email('Invalid email'),
      name: z.string().min(1, 'Required'),
    });
    expect(validateForm(schema, { email: 'bad', name: '' })).toEqual({
      success: false,
      data: null,
      fieldErrors: { email: 'Invalid email', name: 'Required' },
    });
  });

  it('reads axios-like errors without importing Axios types', () => {
    expect(
      getApiErrorMessage({
        message: 'Request failed',
        response: { data: { message: 'Server says no' } },
      }),
    ).toBe('Server says no');
    expect(isNetworkDisconnectError({ request: {}, response: undefined })).toBe(true);
  });
});
