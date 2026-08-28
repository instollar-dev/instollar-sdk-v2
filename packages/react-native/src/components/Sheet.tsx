import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal as RNModal,
  Platform,
  StyleSheet,
  View,
  type ModalProps as RNModalProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DismissKeyboardPressable } from './DismissKeyboardPressable';
import { useThemeColors } from '../theme/ThemeProvider';

const SLIDE_OFFSET = Dimensions.get('window').height;
const ENTER_MS = 280;
const EXIT_MS = 220;
/** Design padding when the host reports no bottom inset. */
const MIN_BOTTOM_PAD = 16;
/**
 * The Modal window is translucent, so it draws under the Android navigation bar.
 * Host insets can't be trusted to describe that bar: they read `0` when the app
 * window is laid out above an opaque bar, and some devices report a small
 * gesture-sized inset even with three-key navigation. Reserve a full soft-key
 * bar (~48dp) as a floor so the sheet always clears it.
 */
const ANDROID_NAV_MIN = 48;

export type SheetProps = Omit<RNModalProps, 'transparent'> & {
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  /** Close when tapping the dimmed backdrop. Default: true. */
  closeOnBackdrop?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Extra bottom padding under the sheet content. Defaults to the host
   * `SafeAreaProvider` bottom inset (Android soft nav / iOS home indicator).
   * Read from the tree *outside* the RN Modal — nested providers inside
   * Modal often report `0` on Android.
   */
  bottomInset?: number;
};

/**
 * Lightweight bottom sheet built on RN Modal.
 * Backdrop appears instantly; panel slides up/down.
 * No @gorhom/bottom-sheet — used for long searchable pickers (e.g. PhoneInput country list).
 */
export function Sheet({
  open,
  onClose,
  children,
  closeOnBackdrop = true,
  style,
  contentContainerStyle,
  bottomInset: bottomInsetProp,
  ...props
}: SheetProps) {
  const colors = useThemeColors();
  // Must run outside the Modal window — a nested SafeAreaProvider inside
  // RN Modal often returns bottom: 0 on Android edge-to-edge.
  const insets = useSafeAreaInsets();
  const floor = Platform.OS === 'android' ? ANDROID_NAV_MIN : MIN_BOTTOM_PAD;
  const bottomInset = Math.max(bottomInsetProp ?? insets.bottom, floor);
  const [mounted, setMounted] = useState(open);
  const translateY = useRef(new Animated.Value(SLIDE_OFFSET)).current;

  useEffect(() => {
    if (open) {
      setMounted(true);
      translateY.setValue(SLIDE_OFFSET);
      Animated.timing(translateY, {
        toValue: 0,
        duration: ENTER_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      return;
    }

    if (!mounted) return;

    Animated.timing(translateY, {
      toValue: SLIDE_OFFSET,
      duration: EXIT_MS,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [open, mounted, translateY]);

  if (!mounted) return null;

  const androidModalProps =
    Platform.OS === 'android'
      ? ({
          statusBarTranslucent: true,
          navigationBarTranslucent: true,
        } as Pick<RNModalProps, 'statusBarTranslucent'> & {
          navigationBarTranslucent?: boolean;
        })
      : undefined;

  return (
    <RNModal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
      {...androidModalProps}
      {...props}
    >
      <View style={styles.root}>
        <DismissKeyboardPressable
          accessibilityRole="button"
          accessibilityLabel="Close sheet"
          style={styles.backdrop}
          onPress={closeOnBackdrop ? onClose : undefined}
        />
        <Animated.View
          style={[
            styles.panel,
            {
              backgroundColor: colors.bg,
              borderColor: colors.border,
              transform: [{ translateY }],
            },
            style,
            // After `style` so callers cannot override soft-nav clearance.
            { paddingBottom: bottomInset },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <View style={[styles.content, contentContainerStyle]}>{children}</View>
        </Animated.View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(1, 43, 21, 0.45)',
  },
  panel: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    maxHeight: '92%',
    zIndex: 1,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 10,
    marginBottom: 4,
  },
  content: {
    paddingHorizontal: 20,
    // Safe-area / soft-nav clearance lives on the panel (`paddingBottom` above).
    paddingBottom: 12,
  },
});
