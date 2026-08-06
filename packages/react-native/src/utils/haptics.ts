export type HapticFeedbackType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'selection'
  | 'success'
  | 'warning'
  | 'error';

let hapticsEnabled = true;

/** Globally enable or disable SDK haptics (default: on). */
export function setHapticsEnabled(enabled: boolean): void {
  hapticsEnabled = enabled;
}

export function getHapticsEnabled(): boolean {
  return hapticsEnabled;
}

type HapticsModule = typeof import('expo-haptics');

const HAPTICS_GLOBAL_KEY = '__INSTOLLAR_EXPO_HAPTICS__';

type HapticsGlobal = typeof globalThis & {
  [HAPTICS_GLOBAL_KEY]?: HapticsModule | null;
};

let cachedHaptics: HapticsModule | null | undefined;

/**
 * Register the host app's `expo-haptics` module.
 *
 * Required for Expo/Metro: the prebundled SDK cannot safely
 * `require('expo-haptics')` at runtime (Metro leaves it as an unknown module).
 *
 * @example
 * ```ts
 * import * as ExpoHaptics from 'expo-haptics';
 * import { registerHapticsModule } from '@instollar-dev/instollar-react-native';
 * registerHapticsModule(ExpoHaptics);
 * ```
 */
export function registerHapticsModule(mod: HapticsModule | null): void {
  (globalThis as HapticsGlobal)[HAPTICS_GLOBAL_KEY] = mod;
  cachedHaptics = mod;
}

function getHapticsModule(): HapticsModule | null {
  if (cachedHaptics !== undefined) return cachedHaptics;

  const injected = (globalThis as HapticsGlobal)[HAPTICS_GLOBAL_KEY];
  if (injected !== undefined) {
    cachedHaptics = injected;
    return cachedHaptics;
  }

  // Do not dynamically require('expo-haptics') here.
  // Metro does not rewrite requires inside the prebundled package, which
  // surfaces "Requiring unknown module expo-haptics" as a redbox.
  cachedHaptics = null;
  return cachedHaptics;
}

/** Fire platform haptic feedback. Safe no-op on web or without expo-haptics. */
export function triggerHapticFeedback(type: HapticFeedbackType = 'light'): void {
  if (!hapticsEnabled) return;

  const Haptics = getHapticsModule();
  if (!Haptics) return;

  void (async () => {
    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'selection':
          await Haptics.selectionAsync();
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } catch {
      // Simulator / unsupported platform
    }
  })();
}

/** Wrap a press handler with haptic feedback before invoking it. */
export function withHapticPress<T extends (...args: never[]) => void>(
  onPress: T | undefined,
  type: HapticFeedbackType = 'light',
): T | undefined {
  if (!onPress) return undefined;
  return ((...args: Parameters<T>) => {
    triggerHapticFeedback(type);
    onPress(...args);
  }) as T;
}
