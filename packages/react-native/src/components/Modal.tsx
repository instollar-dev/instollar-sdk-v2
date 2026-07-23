import type { ReactNode } from 'react';
import {
  Modal as RNModal,
  Pressable,
  StyleSheet,
  View,
  type ModalProps as RNModalProps,
} from 'react-native';
import { useThemeColors } from '../theme/ThemeProvider';

export type ModalProps = Omit<RNModalProps, 'transparent'> & {
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  /** Close when tapping the dimmed backdrop (default true). */
  closeOnBackdrop?: boolean;
};

export function Modal({
  open,
  onClose,
  children,
  closeOnBackdrop = true,
  animationType = 'fade',
  ...props
}: ModalProps) {
  const colors = useThemeColors();

  return (
    <RNModal
      visible={open}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
      {...props}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
          style={styles.backdrop}
          onPress={closeOnBackdrop ? onClose : undefined}
        />
        <View style={[styles.sheet, { backgroundColor: colors.bg, borderColor: colors.border }]}>
          {children}
        </View>
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
