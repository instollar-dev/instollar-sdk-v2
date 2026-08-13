import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Modal as RNModal,
  StyleSheet,
  View,
  type ModalProps as RNModalProps,
} from 'react-native';
import { DismissKeyboardPressable } from './DismissKeyboardPressable';
import { useThemeColors } from '../theme/ThemeProvider';

const PANEL_OFFSET = 32;
const ENTER_MS = 280;
const EXIT_MS = 220;

export type ModalProps = Omit<RNModalProps, 'transparent'> & {
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  /** Close when tapping the dimmed backdrop (default true). */
  closeOnBackdrop?: boolean;
};

/**
 * Centered dialog on RN Modal.
 * Backdrop appears instantly; panel fades/slides in.
 */
export function Modal({
  open,
  onClose,
  children,
  closeOnBackdrop = true,
  ...props
}: ModalProps) {
  const colors = useThemeColors();
  const [mounted, setMounted] = useState(open);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(PANEL_OFFSET)).current;

  useEffect(() => {
    if (open) {
      setMounted(true);
      opacity.setValue(0);
      translateY.setValue(PANEL_OFFSET);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: ENTER_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: ENTER_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!mounted) return;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: EXIT_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: PANEL_OFFSET,
        duration: EXIT_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [open, mounted, opacity, translateY]);

  if (!mounted) return null;

  return (
    <RNModal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
      {...props}
    >
      <View style={styles.root}>
        <DismissKeyboardPressable
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
          style={styles.backdrop}
          onPress={closeOnBackdrop ? onClose : undefined}
        />
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.bg,
              borderColor: colors.border,
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(1, 43, 21, 0.45)',
  },
  sheet: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    zIndex: 1,
  },
});
