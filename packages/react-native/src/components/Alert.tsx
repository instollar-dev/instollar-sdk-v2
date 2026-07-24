import type { ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from './Text';
import { CloseCircle, InfoCircle, TickCircle, Warning2 } from './Icon';
import { useThemeColors } from '../theme/ThemeProvider';
import {
  alertContainerStyle,
  alertIconColor,
  type AlertVariant,
} from '../styles/alertStyles';

export type { AlertVariant };

export type AlertProps = {
  variant?: AlertVariant;
  appearance?: 'inline' | 'toast';
  title?: ReactNode;
  onDismiss?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const iconMap = {
  success: TickCircle,
  error: Warning2,
  destructive: Warning2,
  warning: Warning2,
  info: InfoCircle,
} as const;

export function Alert({
  variant = 'info',
  appearance = 'inline',
  title,
  onDismiss,
  children,
  style,
}: AlertProps) {
  const colors = useThemeColors();
  const IconComp = iconMap[variant];
  const paint = alertIconColor(colors, variant);

  return (
    <View style={[alertContainerStyle(colors, variant, appearance), style]}>
      <IconComp size={16} color={paint} variant="Linear" />
      <View style={{ flex: 1, gap: 4 }}>
        {title ? (
          typeof title === 'string' ? (
            <Text variant="open-bold-p">{title}</Text>
          ) : (
            title
          )
        ) : null}
        {children ? (
          typeof children === 'string' ? (
            <Text variant="open-regular-p" muted>
              {children}
            </Text>
          ) : (
            children
          )
        ) : null}
      </View>
      {onDismiss ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss" onPress={onDismiss}>
          <CloseCircle size={16} color={colors.muted} variant="Linear" />
        </Pressable>
      ) : null}
    </View>
  );
}
