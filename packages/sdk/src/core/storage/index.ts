export type { IStorage } from './storage';
export {
  StorageKeys,
  initStorage,
  initStorageAuto,
  getStorage,
  isStorageInitialized,
  getFromStorage,
  saveToStorage,
  removeFromStorage,
  clearStorage,
} from './storage';
export { createWebStorage } from './web-storage';
export { createExpoSecureStorage } from './mobile-storage';
export { detectPlatform, isWeb, isMobile } from './platform-detection';
