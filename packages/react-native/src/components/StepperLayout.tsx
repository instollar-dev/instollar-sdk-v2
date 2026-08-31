import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from './Button';
import { Stepper } from './Stepper';
import { useThemeColors } from '../theme/ThemeProvider';

export type StepperLayoutProps = {
  step: number;
  totalSteps: number;
  children: ReactNode;
  previousLabel?: string;
  nextLabel?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  hidePrevious?: boolean;
  hideFooter?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  footerStyle?: StyleProp<ViewStyle>;
};

export function StepperLayout({
  step,
  totalSteps,
  children,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  onPrevious,
  onNext,
  previousDisabled = false,
  nextDisabled = false,
  nextLoading = false,
  hidePrevious = false,
  hideFooter = false,
  style,
  contentStyle,
  footerStyle,
}: StepperLayoutProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }, style]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Stepper step={step} totalSteps={totalSteps} />
        </View>

        <View style={[styles.body, contentStyle]}>{children}</View>

        {hideFooter ? null : (
          <View
            style={[
              styles.footer,
              {
                borderTopColor: colors.border,
                backgroundColor: colors.bg,
                paddingBottom: insets.bottom + 12,
              },
              footerStyle,
              // Keep soft-nav clearance even if callers set paddingBottom.
              { paddingBottom: insets.bottom + 12 },
            ]}>
            <View style={styles.footerInner}>
              {hidePrevious ? (
                <View style={styles.footerSpacer} />
              ) : (
                <Button
                  variant="ghost"
                  style={styles.footerBtn}
                  disabled={previousDisabled}
                  onPress={onPrevious}>
                  {previousLabel}
                </Button>
              )}
              <Button
                loading={nextLoading}
                style={styles.footerBtn}
                disabled={nextDisabled}
                onPress={onNext}>
                {nextLabel}
              </Button>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  body: {
    flex: 1,
    minHeight: 0,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  footerBtn: {
    flex: 1,
  },
  footerSpacer: {
    flex: 1,
  },
});
