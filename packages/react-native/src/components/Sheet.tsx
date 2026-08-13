import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal as RNModal,
  StyleSheet,
  View,
  type ModalProps as RNModalProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { DismissKeyboardPressable } from './DismissKeyboardPressable';
import { useThemeColors } from '../theme/ThemeProvider';

const SLIDE_OFFSET = Dimensions.get('window').height;
const ENTER_MS = 280;
const EXIT_MS = 220;

export type SheetProps = Omit<RNModalProps, 'transparent'> & {
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  /** Close when tapping the dimmed backdrop. Default: true. */
  closeOnBackdrop?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
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
  ...props
}: SheetProps) {
  const colors = useThemeColors();
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
    paddingBottom: 28,
  },
});
