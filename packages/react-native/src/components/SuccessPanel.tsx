import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from './Button';
import { Text } from './Text';
import { TickCircle } from './Icon';
import { useThemeColors } from '../theme/ThemeProvider';
import { triggerHapticFeedback } from '../utils/haptics';

export type SuccessPanelProps = {
  title?: string;
  description?: string;
  /** Defaults to the green seal checkmark. */
  icon?: ReactNode;
  /** Extra content below the description (replaces the default button when set). */
  children?: ReactNode;
  buttonLabel?: string;
  onButtonClick?: () => void;
  style?: StyleProp<ViewStyle>;
};

export const DEFAULT_SUCCESS_TITLE = 'Success!';
export const DEFAULT_SUCCESS_DESCRIPTION = 'Your action completed successfully.';
export const DEFAULT_SUCCESS_BUTTON_LABEL = 'Okay, thanks!';

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

/** Shared success body — used by SuccessModal and SuccessBottomSheet. */
export function SuccessPanel({
  title = DEFAULT_SUCCESS_TITLE,
  description = DEFAULT_SUCCESS_DESCRIPTION,
  icon,
  children,
  buttonLabel = DEFAULT_SUCCESS_BUTTON_LABEL,
  onButtonClick,
  style,
}: SuccessPanelProps) {
  return (
    <View style={[{ gap: 16, alignItems: 'center', paddingVertical: 8 }, style]}>
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
            triggerHapticFeedback('success');
            onButtonClick?.();
          }}
        >
          {buttonLabel}
        </Button>
      )}
    </View>
  );
}
