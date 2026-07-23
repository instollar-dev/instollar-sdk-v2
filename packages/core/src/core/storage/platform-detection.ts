import type { Platform } from '../types';

export const detectPlatform = (): Platform => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return 'web';
  }

  if (typeof global !== 'undefined') {
    const g = global as Record<string, unknown>;
    if (g.__fbBatchedBridge !== undefined || g.HermesInternal !== undefined) {
      return 'mobile';
    }
    if ((g.navigator as { product?: string } | undefined)?.product === 'ReactNative') {
      return 'mobile';
    }
    if (typeof window === 'undefined' && typeof process === 'undefined') {
      return 'mobile';
    }
  }

  return 'web';
};

export const isWeb = (): boolean => detectPlatform() === 'web';
export const isMobile = (): boolean => detectPlatform() === 'mobile';
