import {
  Pressable,
  type PressableProps,
} from 'react-native';

import { dismissKeyboard } from '../utils/keyboard';

export type DismissKeyboardPressableProps = PressableProps & {
  /**
   * Dismiss the keyboard on press-in when this control is not a text field.
   * Default: `true`.
   */
  dismissKeyboard?: boolean;
};

/**
 * Pressable for non-text controls. Dismisses the keyboard on press so taps on
 * buttons, checkboxes, selects, etc. hide an open keyboard.
 */
export function DismissKeyboardPressable({
  dismissKeyboard: shouldDismiss = true,
  disabled,
  onPressIn,
  ...props
}: DismissKeyboardPressableProps) {
  return (
    <Pressable
      disabled={disabled}
      onPressIn={(event) => {
        if (!disabled && shouldDismiss) dismissKeyboard();
        onPressIn?.(event);
      }}
      {...props}
    />
  );
}
