import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from './Text';
import { Briefcase, Clock, TickCircle, CloseCircle } from './Icon';
import { useThemeColors } from '../theme/ThemeProvider';

/** @deprecated Use StatusVariant */
export type StatusTone = 'success' | 'destructive' | 'neutral';

export type StatusVariant =
  | 'success'
  | 'successTint'
  | 'info'
  | 'progress'
  | 'warning'
  | 'warningAmber'
  | 'danger'
  | 'dangerBordered'
  | 'dangerStrong'
  | 'dangerTint'
  | 'review'
  | 'muted'
  | 'neutral';

export type StatusBadgeSize = 'sm' | 'md' | 'lg';
export type StatusIcon = 'check' | 'clock' | 'ban' | 'briefcase' | 'none';

export type StatusBadgeProps = {
  variant?: StatusVariant;
  status?: string;
  label?: string;
  icon?: StatusIcon | ReactNode | false;
  showIcon?: boolean;
  size?: StatusBadgeSize;
  /** @deprecated */
  tone?: StatusTone;
  prefix?: ReactNode;
  suffix?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const variantStyles: Record<StatusVariant, { bg: string; text: string; border?: string }> = {
  success: { bg: '#E8FDF0', text: '#0F973D' },
  successTint: { bg: '#D4F8D3', text: '#151515' },
  info: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  progress: { bg: '#F0F5FF', text: '#1E40AF', border: '#DBEAFE' },
  warning: { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  warningAmber: { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  danger: { bg: '#FEF2F2', text: '#D92D20' },
  dangerBordered: { bg: '#FEF2F2', text: '#D92D20', border: '#FECACA' },
  dangerStrong: { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
  dangerTint: { bg: '#FBE7E9', text: '#151515' },
  review: { bg: '#F5F3FF', text: '#5B21B6', border: '#DDD6FE' },
  muted: { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' },
  neutral: { bg: '#F9FAFB', text: '#4B5563', border: '#E5E7EB' },
};

const sizePad: Record<StatusBadgeSize, { px: number; py: number; font: number }> = {
  sm: { px: 8, py: 2, font: 10 },
  md: { px: 10, py: 4, font: 12 },
  lg: { px: 12, py: 6, font: 14 },
};

function resolveVariant(props: StatusBadgeProps): StatusVariant {
  if (props.variant) return props.variant;
  if (props.tone === 'success') return 'success';
  if (props.tone === 'destructive') return 'danger';
  return 'neutral';
}

export type StatusRule = {
  match: (status: string) => boolean;
  variant: StatusVariant;
  label?: string;
  icon?: StatusIcon;
};

export type StatusResolverConfig = {
  rules: StatusRule[];
  fallback?: { variant: StatusVariant; label?: string; icon?: StatusIcon };
};

export type ResolvedStatus = {
  variant: StatusVariant;
  label: string;
  icon?: StatusIcon;
};

export function createStatusResolver(config: StatusResolverConfig) {
  const resolve = (status?: string | null): ResolvedStatus => {
    const value = status ?? '';
    for (const rule of config.rules) {
      if (rule.match(value)) {
        return {
          variant: rule.variant,
          label: rule.label ?? value,
          icon: rule.icon,
        };
      }
    }
    return {
      variant: config.fallback?.variant ?? 'neutral',
      label: config.fallback?.label ?? (value || 'Unknown'),
      icon: config.fallback?.icon,
    };
  };

  function ResolvedStatusBadge({
    status,
    ...rest
  }: Omit<StatusBadgeProps, 'variant' | 'label' | 'icon'> & { status?: string }) {
    const resolved = resolve(status);
    return (
      <StatusBadge
        {...rest}
        status={status}
        variant={resolved.variant}
        label={resolved.label}
        icon={resolved.icon}
      />
    );
  }

  return { StatusBadge: ResolvedStatusBadge, resolve };
}

export function StatusBadge({
  variant: variantProp,
  status,
  label,
  icon = 'none',
  showIcon = true,
  size = 'md',
  tone,
  prefix,
  suffix,
  style,
}: StatusBadgeProps) {
  const colors = useThemeColors();
  const variant = resolveVariant({ variant: variantProp, tone });
  const palette = variantStyles[variant];
  const pad = sizePad[size];
  const text = label ?? status ?? '';

  let iconNode: ReactNode = null;
  if (showIcon && icon !== false && icon !== 'none') {
    if (typeof icon === 'string') {
      const color = palette.text;
      if (icon === 'check') iconNode = <TickCircle size={12} color={color} variant="Linear" />;
      else if (icon === 'clock') iconNode = <Clock size={12} color={color} variant="Linear" />;
      else if (icon === 'ban') iconNode = <CloseCircle size={12} color={color} variant="Linear" />;
      else if (icon === 'briefcase')
        iconNode = <Briefcase size={12} color={color} variant="Linear" />;
    } else {
      iconNode = icon;
    }
  }

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: 6,
          paddingHorizontal: pad.px,
          paddingVertical: pad.py,
          borderRadius: 6,
          backgroundColor: palette.bg,
          borderWidth: palette.border ? 1 : 0,
          borderColor: palette.border ?? 'transparent',
        },
        style,
      ]}
    >
      {prefix}
      {iconNode}
      <Text
        variant="open-regular-tiny"
        style={{ color: palette.text || colors.fg, fontSize: pad.font, fontWeight: '600' }}
      >
        {text}
      </Text>
      {suffix}
    </View>
  );
}
