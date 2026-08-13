import { Children, Fragment, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { ArrowRight2 } from './Icon';
import { RipplePressable } from './RipplePressable';
import { Text } from './Text';
import { useResolvedScheme, useThemeColors } from '../theme/ThemeProvider';
import { triggerHapticFeedback } from '../utils/haptics';

export type TileProps = {
  onPress?: () => void;
  leading?: ReactNode;
  trailing?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  disabled?: boolean;
  /** Uses danger color for title / default chevron (e.g. Log out). */
  destructive?: boolean;
  /** When true (default), fires a light haptic on press. */
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Tile({
  onPress,
  leading,
  trailing,
  title,
  subtitle,
  disabled = false,
  destructive = false,
  haptic = true,
  style,
}: TileProps) {
  const colors = useThemeColors();
  const scheme = useResolvedScheme();
  const tint = destructive ? colors.danger : colors.fg;
  const mutedTint = destructive ? colors.danger : colors.muted;
  const isPressable = Boolean(onPress) && !disabled;

  const rippleColor = destructive
    ? `${colors.danger}40`
    : scheme === 'dark'
      ? 'rgba(255, 255, 255, 0.18)'
      : 'rgba(1, 43, 21, 0.12)';

  const resolvedTrailing =
    trailing !== undefined ? (
      trailing
    ) : onPress ? (
      <ArrowRight2 size={18} color={mutedTint} variant="Linear" />
    ) : null;

  const content = (
    <>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.body}>
        {title != null ? (
          typeof title === 'string' ? (
            <Text variant="open-regular-p" style={{ color: tint }} numberOfLines={1}>
              {title}
            </Text>
          ) : (
            title
          )
        ) : null}
        {subtitle != null ? (
          typeof subtitle === 'string' ? (
            <Text variant="open-regular-tiny" style={{ color: mutedTint }} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : (
            subtitle
          )
        ) : null}
      </View>
      {resolvedTrailing}
    </>
  );

  if (!isPressable) {
    return (
      <View style={[styles.row, { opacity: disabled ? 0.5 : 1 }, style]}>
        {content}
      </View>
    );
  }

  return (
    <RipplePressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      rippleColor={rippleColor}
      onPressIn={() => {
        if (haptic) triggerHapticFeedback('selection');
      }}
      onPress={onPress}
      style={[styles.row, style]}>
      {content}
    </RipplePressable>
  );
}

export type TileGroupProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Bordered card that stacks Tiles with hairline dividers. */
export function TileGroup({ children, style }: TileGroupProps) {
  const colors = useThemeColors();
  const items = Children.toArray(children).filter(Boolean);

  return (
    <View
      style={[
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 16,
          overflow: 'hidden',
        },
        style,
      ]}>
      {items.map((child, index) => (
        <Fragment key={index}>
          {index > 0 ? (
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: colors.border,
                marginLeft: 48,
              }}
            />
          ) : null}
          {child}
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  leading: {
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
});
