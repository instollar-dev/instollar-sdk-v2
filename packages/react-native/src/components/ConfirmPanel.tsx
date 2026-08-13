import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Button } from './Button';
import { Logout, Trash, Warning2 } from './Icon';
import { Text } from './Text';
import { useThemeColors } from '../theme/ThemeProvider';
import { triggerHapticFeedback } from '../utils/haptics';
import type { ConfirmIconPreset, ConfirmVariant } from '@instollar-dev/instollar-core';

export type ConfirmPanelProps = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  icon?: ConfirmIconPreset | ReactNode;
  loading?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  /** Extra bottom padding on the footer (e.g. safe-area inset). */
  bottomInset?: number;
  style?: StyleProp<ViewStyle>;
};

function iconPresetForVariant(variant: ConfirmVariant): ConfirmIconPreset {
  if (variant === 'danger') return 'danger';
  if (variant === 'warning') return 'warning';
  return 'warning';
}

function confirmButtonVariant(variant: ConfirmVariant): 'primary' | 'danger' | 'destructive' {
  if (variant === 'danger') return 'danger';
  if (variant === 'warning') return 'destructive';
  return 'primary';
}

export function ConfirmWarningIcon() {
  return (
    <View style={styles.iconWrap}>
      <Warning2 size={36} color="#D97706" variant="Bold" />
    </View>
  );
}

export function ConfirmDangerIcon() {
  return (
    <View style={[styles.iconWrap, { backgroundColor: '#FEE2E2' }]}>
      <Trash size={34} color="#DC2626" variant="Bold" />
    </View>
  );
}

export function ConfirmLogoutIcon() {
  return (
    <View style={styles.iconWrap}>
      <Logout size={34} color="#B45309" variant="Bold" />
    </View>
  );
}

function resolveConfirmIcon(
  icon: ConfirmIconPreset | ReactNode | undefined,
  variant: ConfirmVariant,
): ReactNode | null {
  if (icon === 'none') return null;
  if (icon && typeof icon !== 'string') return icon;

  const preset = icon ?? iconPresetForVariant(variant);
  switch (preset) {
    case 'danger':
      return <ConfirmDangerIcon />;
    case 'logout':
      return <ConfirmLogoutIcon />;
    case 'warning':
      return <ConfirmWarningIcon />;
    default:
      return null;
  }
}

/** Shared confirm body — used by ConfirmSheet and imperative ConfirmProvider. */
export function ConfirmPanel({
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  icon,
  loading = false,
  onCancel,
  onConfirm,
  bottomInset = 0,
  style,
}: ConfirmPanelProps) {
  const colors = useThemeColors();
  const resolvedIcon = resolveConfirmIcon(icon, variant);

  return (
    <View style={style}>
      <View style={styles.body}>
        {resolvedIcon}
        <Text variant="spline-bold-h4" style={{ textAlign: 'center', color: colors.fg }}>
          {title}
        </Text>
        {description ? (
          <Text variant="open-regular-p" muted style={{ textAlign: 'center', lineHeight: 22 }}>
            {description}
          </Text>
        ) : null}
      </View>

      <View
        style={[
          styles.footer,
          {
            borderTopColor: colors.border,
            backgroundColor: colors.bg,
            paddingBottom: Math.max(bottomInset, 12),
          },
        ]}>
        <View style={styles.footerInner}>
          <Button
            variant="ghost"
            disabled={loading}
            style={styles.footerBtn}
            onPress={() => {
              triggerHapticFeedback('light');
              onCancel?.();
            }}>
            {cancelLabel}
          </Button>
          <Button
            variant={confirmButtonVariant(variant)}
            loading={loading}
            style={styles.footerBtn}
            onPress={() => {
              triggerHapticFeedback(variant === 'default' ? 'success' : 'warning');
              onConfirm?.();
            }}>
            {confirmLabel}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 16,
    paddingTop: 4,
    paddingBottom: 20,
    paddingHorizontal: 4,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginHorizontal: -20,
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
});
