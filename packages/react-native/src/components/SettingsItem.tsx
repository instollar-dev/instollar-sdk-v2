import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { DismissKeyboardPressable } from './DismissKeyboardPressable';
import { Text } from './Text';
import { ArrowDown2, ArrowRight2 } from './Icon';
import { useThemeColors } from '../theme/ThemeProvider';
import { triggerHapticFeedback } from '../utils/haptics';

export type SettingsItemProps = {
  icon: ReactNode;
  title: string;
  description: string;
  isOpen?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function SettingsItem({
  icon,
  title,
  description,
  isOpen = false,
  onClick,
  children,
  style,
}: SettingsItemProps) {
  const colors = useThemeColors();
  const Chevron = isOpen ? ArrowDown2 : ArrowRight2;

  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: colors.bg,
        },
        style,
      ]}
    >
      <DismissKeyboardPressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPressIn={() => triggerHapticFeedback('light')}
        onPress={onClick}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          padding: 16,
        }}
      >
        <View>{icon}</View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="open-bold-p">{title}</Text>
          <Text variant="open-regular-tiny" muted>
            {description}
          </Text>
        </View>
        <Chevron size={18} color={colors.muted} variant="Linear" />
      </DismissKeyboardPressable>
      {isOpen && children != null ? (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.border,
            padding: 16,
          }}
        >
          {children}
        </View>
      ) : null}
    </View>
  );
}
