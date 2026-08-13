import type { ReactNode } from 'react';
import {
  StyleSheet,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { DismissKeyboardPressable } from './DismissKeyboardPressable';

const RIPPLE_DURATION_MS = 420;
const RIPPLE_FADE_MS = 480;

function farthestCornerRadius(width: number, height: number, x: number, y: number): number {
  'worklet';
  const d1 = Math.hypot(x, y);
  const d2 = Math.hypot(width - x, y);
  const d3 = Math.hypot(x, height - y);
  const d4 = Math.hypot(width - x, height - y);
  return Math.max(d1, d2, d3, d4) + 6;
}

export type RipplePressableProps = Omit<PressableProps, 'children' | 'style'> & {
  children: ReactNode;
  /** Semi-transparent fill for the expanding ripple disc. */
  rippleColor: string;
  style?: StyleProp<ViewStyle>;
  dismissKeyboard?: boolean;
};

/**
 * Pressable with a Material-style ripple that expands from the touch origin.
 * Works on iOS and Android (Reanimated); clip with `overflow: 'hidden'` on a parent.
 */
export function RipplePressable({
  children,
  rippleColor,
  style,
  dismissKeyboard = true,
  disabled,
  onPressIn,
  onLayout,
  ...props
}: RipplePressableProps) {
  const layoutW = useSharedValue(0);
  const layoutH = useSharedValue(0);
  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  const radius = useSharedValue(48);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const rippleStyle = useAnimatedStyle(() => {
    const size = radius.value * 2;
    return {
      width: size,
      height: size,
      borderRadius: radius.value,
      left: originX.value - radius.value,
      top: originY.value - radius.value,
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    layoutW.value = event.nativeEvent.layout.width;
    layoutH.value = event.nativeEvent.layout.height;
    onLayout?.(event);
  };

  const handlePressIn = (event: GestureResponderEvent) => {
    if (disabled) return;

    const { locationX, locationY } = event.nativeEvent;
    const width = layoutW.value > 0 ? layoutW.value : 280;
    const height = layoutH.value > 0 ? layoutH.value : 52;

    originX.value = locationX;
    originY.value = locationY;
    radius.value = farthestCornerRadius(width, height, locationX, locationY);
    scale.value = 0;
    opacity.value = 0.32;

    scale.value = withTiming(1, {
      duration: RIPPLE_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(0, {
      duration: RIPPLE_FADE_MS,
      easing: Easing.out(Easing.quad),
    });

    onPressIn?.(event);
  };

  return (
    <DismissKeyboardPressable
      {...props}
      disabled={disabled}
      dismissKeyboard={dismissKeyboard}
      onLayout={handleLayout}
      onPressIn={handlePressIn}
      style={[styles.root, style]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.ripple, { backgroundColor: rippleColor }, rippleStyle]}
      />
      {children}
    </DismissKeyboardPressable>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
  },
  ripple: {
    position: 'absolute',
  },
});
