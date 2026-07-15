import type { IStorage } from './storage';

export const createExpoSecureStorage = (): IStorage => {
  const SecureStore = require('expo-secure-store') as {
    getItemAsync: (key: string) => Promise<string | null>;
    setItemAsync: (key: string, value: string) => Promise<void>;
    deleteItemAsync: (key: string) => Promise<void>;
  };
  return {
    getItem: async (key: string) => {
      try {
        return await SecureStore.getItemAsync(key);
      } catch {
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      await SecureStore.setItemAsync(key, value);
    },
    removeItem: async (key: string) => {
      await SecureStore.deleteItemAsync(key);
    },
    clear: async () => {
      throw new Error(
        '[instollar-sdk] SecureStore does not support clear(). Use removeFromStorage(key) for individual keys.',
      );
    },
  };
};

export default createExpoSecureStorage;
