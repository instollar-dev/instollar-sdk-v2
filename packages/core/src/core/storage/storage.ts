import { detectPlatform } from './platform-detection';
import { createWebStorage } from './web-storage';
import { createExpoSecureStorage } from './mobile-storage';

export interface IStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

export enum StorageKeys {
  TOKEN_DATA = 'instollar_sdk_token_data',
  APP_CONFIG = 'instollar_sdk_app_config',
}

let storageInstance: IStorage | null = null;

export const initStorage = (storage: IStorage): void => {
  storageInstance = storage;
};

export const initStorageAuto = (): void => {
  const platform = detectPlatform();
  if (platform === 'web') {
    storageInstance = createWebStorage();
  } else {
    storageInstance = createExpoSecureStorage();
  }
};

export const getStorage = (): IStorage => {
  if (!storageInstance) {
    throw new Error(
      '[instollar-sdk] Storage not initialized. Call initStorage() or initStorageAuto() first.',
    );
  }
  return storageInstance;
};

export const isStorageInitialized = (): boolean => storageInstance !== null;

export const getFromStorage = async <T>(key: StorageKeys | string): Promise<T | null> => {
  const storage = getStorage();
  const value = await storage.getItem(key);
  if (value === null) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
};

export const saveToStorage = async <T>(key: StorageKeys | string, value: T): Promise<void> => {
  const storage = getStorage();
  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  await storage.setItem(key, serialized);
};

export const removeFromStorage = async (key: StorageKeys | string): Promise<void> => {
  const storage = getStorage();
  await storage.removeItem(key);
};

export const clearStorage = async (): Promise<void> => {
  const storage = getStorage();
  try {
    await storage.clear();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('clear') || msg.includes('clearing')) {
      await Promise.all([
        removeFromStorage(StorageKeys.TOKEN_DATA),
        removeFromStorage(StorageKeys.APP_CONFIG),
      ]);
      return;
    }
    throw error;
  }
};
