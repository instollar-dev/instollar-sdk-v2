import { getSDKConfig } from './axios-setup';
import type { ApiService } from '../types';

function sanitizeBaseUrl(url: string): string {
  return url.replace(/[\u2028\u2029]/g, '').trim().replace(/\/$/, '');
}

/** Resolve a full URL for a service + path. BASE returns the path unchanged (axios baseUrl applies). */
export function apiUrl(service: ApiService, path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (service === 'base') return normalizedPath;

  const config = getSDKConfig();
  const serviceBase = config.baseUrls?.[service];
  if (!serviceBase) {
    throw new Error(
      `[instollar-sdk] Missing baseUrls.${service}. Pass it in initInstollarSDK({ baseUrls: { ${service}: '...' } }).`,
    );
  }
  return `${sanitizeBaseUrl(serviceBase)}${normalizedPath}`;
}
