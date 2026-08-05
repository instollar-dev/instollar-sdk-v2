import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';
import { triggerHapticFeedback } from '../utils/haptics';

export type TabModel = {
  label: string;
  value: string;
  content?: ReactNode | (() => ReactNode);
  path?: string;
};

export type TabV2Model = TabModel;

export type TabsRouterAdapter = {
  pathname: string;
  replace: (path: string) => void;
};

export type TabsProps = {
  tabs: TabModel[] | string[];
  activeTab?: string;
  defaultTab?: string;
  onTabChange?: (value: string) => void;
  fullWidth?: boolean;
  variant?: 'yellow' | 'green';
  trailing?: ReactNode;
  betweenContent?: ReactNode;
  useRoutes?: boolean;
  basePath?: string;
  router?: TabsRouterAdapter;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

function normalizeTabs(tabs: TabsProps['tabs']): TabModel[] {
  return tabs.map((tab) =>
    typeof tab === 'string' ? { label: tab, value: tab } : tab,
  );
}

export function Tabs({
  tabs: tabsProp,
  activeTab,
  defaultTab,
  onTabChange,
  fullWidth = false,
  variant = 'green',
  trailing,
  betweenContent,
  useRoutes,
  basePath = '',
  router,
  style,
  contentStyle,
}: TabsProps) {
  const colors = useThemeColors();
  const tabs = useMemo(() => normalizeTabs(tabsProp), [tabsProp]);
  const first = tabs[0]?.value;
  const controlled = activeTab !== undefined;
  const [internal, setInternal] = useState(defaultTab ?? first);
  const current = controlled ? activeTab : internal;
  const underline = variant === 'yellow' ? '#F49E0C' : '#002816';

  useEffect(() => {
    if (!controlled && current) onTabChange?.(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount parity with web
  }, []);

  const select = (value: string, path?: string) => {
    if (value !== current) triggerHapticFeedback('selection');
    if (!controlled) setInternal(value);
    onTabChange?.(value);
    if (useRoutes && router) {
      router.replace(`${basePath}${path ?? value}`);
    }
  };

  const active = tabs.find((t) => t.value === current) ?? tabs[0];
  const content =
    typeof active?.content === 'function' ? active.content() : active?.content;

  return (
    <View style={style}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: fullWidth ? 1 : undefined,
            gap: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          {tabs.map((tab) => {
            const selected = tab.value === current;
            return (
              <Pressable
                key={tab.value}
                onPress={() => select(tab.value, tab.path)}
                style={{
                  flex: fullWidth ? 1 : undefined,
                  paddingVertical: 10,
                  borderBottomWidth: 2,
                  borderBottomColor: selected ? underline : 'transparent',
                  alignItems: 'center',
                }}
              >
                <Text
                  variant="open-bold-p"
                  style={{ color: selected ? colors.fg : colors.muted }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        {trailing}
      </View>
      {betweenContent}
      {content != null ? <View style={[{ paddingTop: 16 }, contentStyle]}>{content}</View> : null}
    </View>
  );
}
