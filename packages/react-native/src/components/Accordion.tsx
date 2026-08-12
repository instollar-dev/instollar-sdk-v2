import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { ArrowDown2, ArrowRight2 } from './Icon';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';
import { triggerHapticFeedback } from '../utils/haptics';
import {
  useAccordion,
  type AccordionType,
  type UseAccordionOptions,
} from '../hooks/useAccordion';

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
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AccordionItem({
  value,
  title,
  description,
  icon,
  disabled = false,
  children,
  style,
}: AccordionItemProps) {
  const colors = useThemeColors();
  const { isOpen, toggle } = useAccordionContext();
  const open = isOpen(value);
  const Chevron = open ? ArrowDown2 : ArrowRight2;

  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: colors.bg,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open, disabled }}
        disabled={disabled}
        onPressIn={() => {
          if (!disabled) triggerHapticFeedback('light');
        }}
        onPress={() => {
          if (!disabled) toggle(value);
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          padding: 16,
        }}
      >
        {icon ? <View>{icon}</View> : null}
        <View style={{ flex: 1, gap: description ? 2 : 0 }}>
          <Text variant="open-bold-p" style={{ color: colors.fg }}>
            {title}
          </Text>
          {description ? (
            <Text variant="open-regular-tiny" muted>
              {description}
            </Text>
          ) : null}
        </View>
        <Chevron size={18} color={colors.muted} variant="Linear" />
      </Pressable>
      {open && children != null ? (
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

export { useAccordion, type AccordionType, type UseAccordionOptions };
