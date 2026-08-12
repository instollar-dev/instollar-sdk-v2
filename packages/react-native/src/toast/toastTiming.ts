import type { ToastType } from '@instollar-dev/instollar-core';

export const DEFAULT_TOAST_DURATION: Record<ToastType, number> = {
  success: 4000,
  error: 5000,
  info: 4000,
  warning: 5000,
  message: 8000,
  default: 4000,
};

export function resolveToastDuration(
  type: ToastType | undefined,
  autoClose?: number,
): number {
  if (autoClose !== undefined) return autoClose;
  return DEFAULT_TOAST_DURATION[type ?? 'default'];
}
