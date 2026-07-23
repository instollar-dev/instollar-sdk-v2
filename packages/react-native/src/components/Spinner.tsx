import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';
import { useThemeColors } from '../theme/ThemeProvider';

export type SpinnerProps = ActivityIndicatorProps & {
  size?: number | 'small' | 'large';
};

export function Spinner({ size = 'small', color, ...props }: SpinnerProps) {
  const colors = useThemeColors();
  const indicatorSize = typeof size === 'number' ? 'small' : size;
  return (
    <ActivityIndicator
      accessibilityLabel="Loading"
      color={color ?? colors.primary}
      size={indicatorSize}
      {...props}
    />
  );
}
