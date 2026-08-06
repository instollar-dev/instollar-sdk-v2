import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';

export type ProgressBarSize = 'sm' | 'md';

export type ProgressBarProps = {
  /** Current progress (0–`max`). */
  value: number;
  /** Maximum value. Default: `100`. */
  max?: number;
  /** Visible label above the bar. Omit for a bare track. */
  label?: string;
  /** Show numeric percentage beside the label. */
  showValue?: boolean;
  size?: ProgressBarSize;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

const trackHeights: Record<ProgressBarSize, number> = {
  sm: 6,
  md: 8,
};

function clampProgress(value: number, max: number): number {
  if (!Number.isFinite(value) || max <= 0) return 0;
  return Math.min(max, Math.max(0, value));
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  style,
  accessibilityLabel,
}: ProgressBarProps) {
  const colors = useThemeColors();
  const clamped = clampProgress(value, max);
  const percent = max > 0 ? Math.round((clamped / max) * 100) : 0;
  const trackHeight = trackHeights[size];
  const hasChrome = Boolean(label || showValue);

  const track = (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? label ?? 'Progress'}
      accessibilityValue={{ min: 0, max, now: clamped }}
      style={[
        {
          width: '100%',
          height: trackHeight,
          borderRadius: trackHeight / 2,
          backgroundColor: colors.border,
          overflow: 'hidden',
        },
        !hasChrome ? style : undefined,
      ]}
    >
      <View
        style={{
          height: '100%',
          width: `${percent}%`,
          borderRadius: trackHeight / 2,
          backgroundColor: colors.destructive,
        }}
      />
    </View>
  );

  if (!hasChrome) return track;

  return (
    <View style={[{ width: '100%', gap: 6 }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {label ? <Text variant="open-regular-label">{label}</Text> : <View />}
        {showValue ? (
          <Text variant="open-regular-label" muted>
            {percent}%
          </Text>
        ) : null}
      </View>
      {track}
    </View>
  );
}
