import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useThemeColors } from '../theme/ThemeProvider';
import { fieldControlSurface } from '../styles/formStyles';

export type FieldControlProps = {
  prefix?: ReactNode;
  suffix?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function FieldControl({
  prefix,
  suffix,
  error,
  disabled,
  children,
  style,
}: FieldControlProps) {
  const colors = useThemeColors();

  return (
    <View style={[fieldControlSurface(colors, { error, disabled }), style]}>
      {prefix ? <View style={{ marginRight: 8 }}>{prefix}</View> : null}
      <View style={{ flex: 1, minWidth: 0 }}>{children}</View>
      {suffix ? <View style={{ marginLeft: 8 }}>{suffix}</View> : null}
    </View>
  );
}
