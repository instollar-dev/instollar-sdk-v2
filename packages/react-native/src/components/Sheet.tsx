import type { ReactNode } from 'react';
import {
  Modal as RNModal,
  Pressable,
  StyleSheet,
  View,
  type ModalProps as RNModalProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useThemeColors } from '../theme/ThemeProvider';

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
 * Lightweight bottom sheet built on RN Modal (slide-up).
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

  return (
    <RNModal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      {...props}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close sheet"
          style={styles.backdrop}
          onPress={closeOnBackdrop ? onClose : undefined}
        />
        <View
          style={[
            styles.panel,
            {
              backgroundColor: colors.bg,
              borderColor: colors.border,
            },
            style,
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <View style={[styles.content, contentContainerStyle]}>{children}</View>
        </View>
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
