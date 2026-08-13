import { Keyboard } from 'react-native';

/** Dismiss the software keyboard if it is currently visible. */
export function dismissKeyboard(): void {
  Keyboard.dismiss();
}
