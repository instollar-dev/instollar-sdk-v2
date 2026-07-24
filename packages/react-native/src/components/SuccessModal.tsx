import type { ReactNode } from 'react';
import { View } from 'react-native';
import { Button } from './Button';
import { Modal } from './Modal';
import { Text } from './Text';
import { TickCircle } from './Icon';
import { useThemeColors } from '../theme/ThemeProvider';

export type SuccessModalProps = {
  open: boolean;
  onClose?: () => void;
  title?: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  buttonLabel?: string;
  onButtonClick?: () => void;
};

export function SuccessModalIcon() {
  const colors = useThemeColors();
  return (
    <View
      style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E8FDF0',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
      }}
    >
      <TickCircle size={32} color={colors.primary} variant="Bold" />
    </View>
  );
}

export function SuccessModal({
  open,
  onClose,
  title = 'Success!',
  description,
  icon,
  children,
  buttonLabel = 'Continue',
  onButtonClick,
}: SuccessModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <View style={{ gap: 16, alignItems: 'center' }}>
        {icon ?? <SuccessModalIcon />}
        <Text variant="spline-bold-h4" style={{ textAlign: 'center' }}>
          {title}
        </Text>
        {description ? (
          <Text variant="open-regular-p" muted style={{ textAlign: 'center' }}>
            {description}
          </Text>
        ) : null}
        {children ?? (
          <Button
            style={{ alignSelf: 'stretch' }}
            onPress={() => {
              onButtonClick?.();
              onClose?.();
            }}
          >
            {buttonLabel}
          </Button>
        )}
      </View>
    </Modal>
  );
}
