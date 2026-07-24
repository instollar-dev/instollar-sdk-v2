import { useState, type ReactNode } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';
import type { TabsRouterAdapter } from './Tabs';

export type SegmentOption = {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  path?: string;
};

export type SegmentsRouterAdapter = TabsRouterAdapter;

export type SegmentsProps = {
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md';
  useRoutes?: boolean;
  basePath?: string;
  router?: SegmentsRouterAdapter;
  style?: StyleProp<ViewStyle>;
};

export function Segments({
  options,
  value,
  defaultValue,
  onChange,
  size = 'md',
  useRoutes,
  basePath = '',
  router,
  style,
}: SegmentsProps) {
  const colors = useThemeColors();
  const controlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? options[0]?.value);
  const current = controlled ? value : internal;
  const pad = size === 'sm' ? 6 : 10;

  const select = (option: SegmentOption) => {
    if (option.disabled) return;
    if (!controlled) setInternal(option.value);
    onChange?.(option.value);
    if (useRoutes && router) {
      router.replace(`${basePath}${option.path ?? option.value}`);
    }
  };

  return (
    <View
      accessibilityRole="radiogroup"
      style={[
        {
          flexDirection: 'row',
          backgroundColor: colors.border,
          borderRadius: 999,
          padding: 4,
          gap: 4,
        },
        style,
      ]}
    >
      {options.map((option) => {
        const selected = option.value === current;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled: option.disabled }}
            disabled={option.disabled}
            onPress={() => select(option)}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              paddingVertical: pad,
              paddingHorizontal: 12,
              borderRadius: 999,
              backgroundColor: selected ? colors.bg : 'transparent',
              opacity: option.disabled ? 0.4 : 1,
            }}
          >
            {option.icon}
            <Text
              variant="open-regular-label"
              style={{ color: selected ? colors.fg : colors.muted, fontWeight: selected ? '700' : '400' }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
