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
import {
  initialWindowMetrics,
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { DismissKeyboardPressable } from './DismissKeyboardPressable';
import { ToastHost } from '../toast/ToastProvider';
import { useThemeColors } from '../theme/ThemeProvider';

const SLIDE_OFFSET = Dimensions.get('window').height;
const ENTER_MS = 280;
const EXIT_MS = 220;
const MIN_BOTTOM_PAD = 16;
/** Soft-key / 3-button nav is often taller than 48dp on real devices. */
const ANDROID_NAV_MIN = 56;

export type SheetProps = Omit<RNModalProps, 'transparent'> & {
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  /** Close when tapping the dimmed backdrop. Default: true. */
  closeOnBackdrop?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Override bottom clearance. Defaults to measured safe-area inset
   * (seeded via `initialWindowMetrics` inside the Modal).
   */
  bottomInset?: number;
};

function sheetBottomClearance(insetBottom: number, override?: number): number {
  const floor = Platform.OS === 'android' ? ANDROID_NAV_MIN : MIN_BOTTOM_PAD;
  return Math.max(override ?? insetBottom, floor);
}

function SheetPanel({
  children,
  closeOnBackdrop,
  onClose,
  style,
  contentContainerStyle,
  bottomInset: bottomInsetProp,
  translateY,
}: {
  children?: ReactNode;
  closeOnBackdrop: boolean;
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  bottomInset?: number;
  translateY: Animated.Value;
}) {
  const colors = useThemeColors();
  // Inside the Modal's own SafeAreaProvider (seeded with initialWindowMetrics).
  const insets = useSafeAreaInsets();
  const bottomClearance = sheetBottomClearance(insets.bottom, bottomInsetProp);

  return (
    <View style={styles.root}>
      <DismissKeyboardPressable
        accessibilityRole="button"
        accessibilityLabel="Close sheet"
        style={[styles.backdrop, { backgroundColor: 'rgba(1, 43, 21, 0.45)' }]}
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
        ]}
      >
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        <View style={[styles.content, contentContainerStyle]}>{children}</View>
        {/* Explicit spacer — more reliable than paddingBottom under native-driver transforms. */}
        <View style={{ height: bottomClearance, backgroundColor: colors.bg }} />
      </Animated.View>
    </View>
  );
}

/**
 * Lightweight bottom sheet built on RN Modal.
 * Backdrop appears instantly; panel slides up/down.
 * No @gorhom/bottom-sheet — used for long searchable pickers (e.g. PhoneInput country list).
 *
 * Soft-nav clearance: RN Modals are a separate window. A nested SafeAreaProvider
 * without seed metrics often reports bottom: 0 on Android, so we seed with
 * `initialWindowMetrics` and keep an Android floor of 48dp.
 */
export function Sheet({
  open,
  onClose,
  children,
  closeOnBackdrop = true,
  style,
  contentContainerStyle,
  bottomInset,
  ...props
}: SheetProps) {
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
      {/* Seed metrics from the host window — empty Modal providers report 0 insets. */}
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <SheetPanel
          closeOnBackdrop={closeOnBackdrop}
          onClose={onClose}
          style={style}
          contentContainerStyle={contentContainerStyle}
          bottomInset={bottomInset}
          translateY={translateY}
        >
          {children}
        </SheetPanel>
        <ToastHost />
      </SafeAreaProvider>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: StyleSheet.absoluteFill,
  panel: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    maxHeight: '92%',
    zIndex: 1,
    overflow: 'hidden',
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
    paddingBottom: 12,
  },
});
