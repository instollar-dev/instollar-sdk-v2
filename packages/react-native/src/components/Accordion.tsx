import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ArrowDown2 } from './Icon';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';
import { triggerHapticFeedback } from '../utils/haptics';
import {
  useAccordion,
  type AccordionType,
  type UseAccordionOptions,
} from '../hooks/useAccordion';

const ANIM_MS = 240;

type AccordionContextValue = {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error('AccordionItem must be used within Accordion');
  }
  return ctx;
}

export type AccordionProps = UseAccordionOptions & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Gap between items. Default: 12. */
  gap?: number;
};

export function Accordion({
  children,
  style,
  gap = 12,
  type = 'single',
  collapsible = true,
  value,
  defaultValue,
  onValueChange,
}: AccordionProps) {
  const accordion = useAccordion({
    type,
    collapsible,
    value,
    defaultValue,
    onValueChange,
  });

  return (
    <AccordionContext.Provider value={accordion}>
      <View style={[{ gap }, style]}>{children}</View>
    </AccordionContext.Provider>
  );
}

export type AccordionItemProps = {
  value: string;
  title: string;
  /** @deprecated Compact accordion headers do not render descriptions. */
  description?: string;
  error?: string;
  icon?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AccordionItem({
  value,
  title,
  error,
  disabled = false,
  children,
  style,
}: AccordionItemProps) {
  const colors = useThemeColors();
  const { isOpen, toggle } = useAccordionContext();
  const expanded = isOpen(value);
  const [contentHeight, setContentHeight] = useState(0);
  const open = useSharedValue(expanded ? 1 : 0);
  const borderColor = error ? colors.destructive : colors.border;

  useEffect(() => {
    open.value = withTiming(expanded ? 1 : 0, {
      duration: ANIM_MS,
      easing: Easing.out(Easing.cubic),
    });
  }, [expanded, open]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(open.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  const bodyStyle = useAnimatedStyle(() => ({
    height: contentHeight * open.value,
  }));

  return (
    <View
      style={[
        styles.wrap,
        {
          borderColor,
          backgroundColor: colors.bg,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded, disabled }}
        disabled={disabled}
        onPressIn={() => {
          if (!disabled) triggerHapticFeedback('light');
        }}
        onPress={() => {
          if (!disabled) toggle(value);
        }}
        style={styles.header}>
        <Text
          variant="open-regular-tiny"
          style={[styles.title, { color: colors.fg }]}>
          {title}
        </Text>
        <Animated.View style={chevronStyle}>
          <ArrowDown2 size={16} color={colors.muted} variant="Linear" />
        </Animated.View>
      </Pressable>

      {error ? (
        <Text
          variant="open-regular-tiny"
          style={[styles.error, { color: colors.destructive }]}>
          {error}
        </Text>
      ) : null}

      {children != null ? (
        <Animated.View style={[styles.bodyAnimated, bodyStyle]}>
          <View
            collapsable={false}
            pointerEvents={expanded ? 'auto' : 'none'}
            style={styles.body}
            onLayout={(event) => {
              const nextHeight = Math.ceil(event.nativeEvent.layout.height);
              setContentHeight((prev) => (prev === nextHeight ? prev : nextHeight));
            }}>
            {children}
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  title: {
    flex: 1,
    fontWeight: '600',
    lineHeight: 18,
  },
  error: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    marginTop: -4,
  },
  bodyAnimated: {
    overflow: 'hidden',
    position: 'relative',
  },
  body: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
});

export { useAccordion, type AccordionType, type UseAccordionOptions };
