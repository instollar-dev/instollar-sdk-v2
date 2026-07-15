export function normalizeString(value?: string | null): string {
  if (!value) return '—';
  return value
    .toLowerCase()
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function maskPhoneNumber(phone: string): string {
  if (!phone) return '';
  const visibleDigits = 3;
  if (phone.length <= visibleDigits) return phone;
  return `${phone.slice(0, -visibleDigits)}***`;
}

export function maskEmailForOtpHint(email: string | null | undefined): string {
  if (!email?.trim()) return '';
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf('@');
  if (atIndex <= 0) return '***';
  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);
  if (!domain) return '***';
  const prefixLength = local.length <= 2 ? 1 : 2;
  return `${local.slice(0, prefixLength)}***@${domain}`;
}
