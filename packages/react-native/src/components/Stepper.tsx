import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';

export type StepperProps = {
  /** Current step (1-based). */
  step: number;
  /** Total number of steps. */
  totalSteps: number;
  style?: StyleProp<ViewStyle>;
};

const PROGRESS_MS = 320;

/** Matches workflow / toolbox step chips (cream soft fill + amber label). */
const STEP_BADGE_BG = '#FFFAEB';
const STEP_BADGE_FG = '#F49E0C';

export function Stepper({ step, totalSteps, style }: StepperProps) {
  const colors = useThemeColors();
  const safeTotal = Math.max(1, totalSteps);
  const safeStep = Math.min(safeTotal, Math.max(1, step));
  const progress = (safeStep / safeTotal) * 100;
  const progressAnim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: PROGRESS_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const fillWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[styles.wrap, style]}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${safeStep} of ${safeTotal}`}
      accessibilityValue={{ min: 1, max: safeTotal, now: safeStep }}>
      <View style={[styles.badge, { backgroundColor: STEP_BADGE_BG }]}>
        <Text variant="open-regular-tiny" style={[styles.badgeText, { color: STEP_BADGE_FG }]}>
          Step {safeStep} of {safeTotal}
        </Text>
      </View>
      <View
        style={[
          styles.track,
          { backgroundColor: colors.border },
        ]}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: fillWidth,
              backgroundColor: STEP_BADGE_FG,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontWeight: '700',
    lineHeight: 16,
  },
  track: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
