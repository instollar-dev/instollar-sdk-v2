import type { IStorage } from './storage';

export const createWebStorage = (): IStorage => ({
  getItem: async (key: string) => localStorage.getItem(key),
  setItem: async (key: string, value: string) => {
    localStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    localStorage.removeItem(key);
  },
  clear: async () => {
    localStorage.clear();
  },
});

export default createWebStorage;
