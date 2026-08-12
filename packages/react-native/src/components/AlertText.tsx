import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from './Text';
import { CloseCircle } from './Icon';
import { useThemeColors } from '../theme/ThemeProvider';
import { triggerHapticFeedback } from '../utils/haptics';

export type AlertTextVariant = 'error' | 'success' | 'pending' | 'info';

export type AlertTextProps = {
  children?: ReactNode;
  variant?: AlertTextVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
};

export type DismissibleAlertProps = AlertTextProps & { dismissible: true };

const variantColor = (
  colors: ReturnType<typeof useThemeColors>,
  variant: AlertTextVariant,
) => {
  switch (variant) {
    case 'success':
      return colors.primary;
    case 'pending':
      return colors.destructive;
    case 'info':
      return colors.fg;
    case 'error':
    default:
      return colors.error;
  }
};

export function AlertText({
  children,
  variant = 'error',
  dismissible = false,
  onDismiss,
  style,
}: AlertTextProps) {
  const colors = useThemeColors();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
  }, [children]);

  if (dismissed || children == null || children === '') return null;

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }, style]}>
      <Text
        variant="open-regular-tiny"
        style={{ color: variantColor(colors, variant), flex: 1 }}
      >
        {children}
      </Text>
      {dismissible ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={() => {
            triggerHapticFeedback('light');
            setDismissed(true);
            onDismiss?.();
          }}
        >
          <CloseCircle size={14} color={colors.muted} variant="Linear" />
        </Pressable>
      ) : null}
    </View>
  );
}

export function dismissibleAlertProps(
  props: Omit<AlertTextProps, 'dismissible'>,
): DismissibleAlertProps {
  return { ...props, dismissible: true };
}
