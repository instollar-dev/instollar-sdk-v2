import { initAxios } from './api';
import type { InstollarSDKConfig } from './types';
import {
  initStorage,
  initStorageAuto,
  type IStorage,
} from './storage';

export type InitInstollarSDKOptions = InstollarSDKConfig & {
  /** Explicit storage adapter — overrides autoStorage */
  storage?: IStorage;
  /** When true (default), picks web localStorage or Expo SecureStore */
  autoStorage?: boolean;
};

export function initInstollarSDK(options: InitInstollarSDKOptions): void {
  const { storage, autoStorage = !storage, ...axiosConfig } = options;

  if (storage) {
    initStorage(storage);
  } else if (autoStorage) {
    initStorageAuto();
  } else {
    throw new Error('[instollar-sdk] Provide storage or set autoStorage: true');
  }

  initAxios(axiosConfig);
}
