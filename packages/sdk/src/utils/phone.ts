export type PhoneParts = {
  phoneCode: string;
  nationalNumber: string;
};

export function formatPhoneForApi(value?: PhoneParts | null): string {
  if (!value?.nationalNumber?.trim()) return '';
  const code = value.phoneCode.replace(/^\+/, '');
  const national = value.nationalNumber.replace(/\D/g, '');
  return `${code}${national}`;
}

export function normalizePhoneForApi(phone?: string | null): string {
  if (phone == null) return '';
  return phone.trim().replace(/\+/g, '');
}
