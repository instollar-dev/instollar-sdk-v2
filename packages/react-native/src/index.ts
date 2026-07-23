export { ThemeProvider, useTheme, useThemeColors } from './theme/ThemeProvider';
export type { ThemeMode, ThemeProviderProps, InstollarTheme } from './theme/ThemeProvider';

export { Text } from './components/Text';
export type { TextProps, TextVariant } from './components/Text';

export { Button } from './components/Button';
export type {
  ButtonProps,
  ButtonVariant,
  ButtonTone,
  ButtonSize,
} from './components/Button';

export { Spinner } from './components/Spinner';
export type { SpinnerProps } from './components/Spinner';

export { Modal } from './components/Modal';
export type { ModalProps } from './components/Modal';

export { ToastProvider } from './toast/ToastProvider';
export type { ToastProviderProps } from './toast/ToastProvider';

/** Re-export core APIs so RN apps can use one UI package + core init. */
export {
  initInstollarSDK,
  toast,
  setToastHandler,
  clearToastHandler,
  api,
  authApi,
  adminApi,
  companyApi,
  installerApi,
  sharedApi,
  initStorage,
  initStorageAuto,
  createExpoSecureStorage,
  detectPlatform,
  isMobile,
  isWeb,
} from '@instollar-dev/instollar-core';
export type {
  InitInstollarSDKOptions,
  ToastOptions,
  ToastType,
  IStorage,
} from '@instollar-dev/instollar-core';
