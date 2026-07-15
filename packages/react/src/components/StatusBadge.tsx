import { isValidElement, type FC, type HTMLAttributes, type ReactNode } from 'react';
import { Briefcase, Clock, Forbidden, TickCircle } from 'iconsax-react';
import { cn } from '../utils/cn';
import {
  statusBadgeBaseClasses,
  statusBadgeEmptyClasses,
  statusBadgeSizeClasses,
  statusBadgeToneClasses,
  statusBadgeVariantBaseClasses,
  statusBadgeVariantClasses,
  type StatusBadgeSize,
  type StatusTone,
  type StatusVariant,
} from './statusBadgeVariants';

export type { StatusTone, StatusVariant, StatusBadgeSize };

export type StatusIcon = 'check' | 'clock' | 'ban' | 'briefcase' | 'none';

export interface StatusBadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'prefix'> {
  /** Explicit variant. If omitted, `status` is resolved via the resolver. */
  variant?: StatusVariant;
  /** Raw status string; resolved via resolver when `variant` not given. */
  status?: string;
  /** Overrides the resolved/derived label. */
  label?: string;
  /** Built-in icon name, custom node, or false to hide. Default: resolver's pick. */
  icon?: StatusIcon | ReactNode | false;
  /** Back-compat boolean. false => no icon. Default true. */
  showIcon?: boolean;
  size?: StatusBadgeSize;
  className?: string;
  /**
   * @deprecated Legacy tone API. When set (and no `variant`/`status` given),
   * renders the original pill styling. Prefer `variant`.
   */
  tone?: StatusTone;
  /** @deprecated Legacy slot rendered before the label. Prefer `icon`. */
  prefix?: ReactNode;
  /** @deprecated Legacy slot rendered after the label. */
  suffix?: ReactNode;
}

export interface StatusRule {
  /** Raw status values this rule matches (case-insensitive, space/hyphen/underscore agnostic). */
  matches: string[];
  variant: StatusVariant;
  icon?: StatusIcon;
  /** Fixed display label; if omitted, label is auto-formatted. */
  label?: string;
}

export interface StatusResolverConfig {
  rules: StatusRule[];
  /** Variant when status is empty/undefined. Default "neutral". */
  emptyVariant?: StatusVariant;
  /** Variant when no rule matches. Default "neutral". */
  fallbackVariant?: StatusVariant;
}

export interface ResolvedStatus {
  variant: StatusVariant;
  label: string;
  icon: StatusIcon;
}

/** "For Review" == "for_review" == "for-review" */
function normalizeStatus(status: string): string {
  return status.trim().toLowerCase().replace(/[\s-]+/g, '_');
}

/** "PENDING_QA" -> "Pending qa" */
function autoLabel(status: string): string {
  const words = status.replace(/_/g, ' ').toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

const ICON_SIZE = 14;

const builtInIcons: Record<Exclude<StatusIcon, 'none'>, FC<{ size: number; color: string }>> = {
  check: TickCircle,
  clock: Clock,
  ban: Forbidden,
  briefcase: Briefcase,
};

function isStatusIconName(icon: unknown): icon is StatusIcon {
  return (
    icon === 'check' || icon === 'clock' || icon === 'ban' || icon === 'briefcase' || icon === 'none'
  );
}

function renderIcon(icon: StatusIcon): ReactNode {
  if (icon === 'none') return null;
  const IconComponent = builtInIcons[icon];
  return <IconComponent size={ICON_SIZE} color="currentColor" aria-hidden />;
}

/**
 * Icon resolution order: props.icon (node | name | false) > showIcon === false
 * (none) > resolved icon > "none".
 */
function resolveIconNode(
  icon: StatusBadgeProps['icon'],
  showIcon: boolean | undefined,
  resolvedIcon: StatusIcon
): ReactNode {
  if (icon === false) return null;
  if (icon !== undefined) {
    if (isStatusIconName(icon)) return renderIcon(icon);
    if (isValidElement(icon) || typeof icon === 'string' || typeof icon === 'number') {
      return icon;
    }
    return null;
  }
  if (showIcon === false) return null;
  return renderIcon(resolvedIcon);
}

interface RenderOptions {
  props: StatusBadgeProps;
  resolved: ResolvedStatus;
  /** Empty status renders the dedicated empty palette instead of the variant palette. */
  isEmpty: boolean;
}

function renderBadge({ props, resolved, isEmpty }: RenderOptions) {
  const {
    variant: _variant,
    status: _status,
    label: labelProp,
    icon,
    showIcon,
    size = 'md',
    className,
    tone: _tone,
    prefix,
    suffix,
    ...rest
  } = props;

  const label = labelProp ?? resolved.label;
  const iconNode = resolveIconNode(icon, showIcon, resolved.icon);

  return (
    <span
      className={cn(
        statusBadgeVariantBaseClasses,
        statusBadgeSizeClasses[size],
        isEmpty ? statusBadgeEmptyClasses : statusBadgeVariantClasses[resolved.variant],
        className
      )}
      {...rest}
    >
      {prefix}
      {iconNode}
      {label ? <span className="font-medium">{label}</span> : null}
      {suffix}
    </span>
  );
}

/** Legacy tone-based pill, kept pixel-identical to the previous SDK StatusBadge. */
function renderLegacyToneBadge(props: StatusBadgeProps) {
  const {
    tone,
    label,
    prefix,
    suffix,
    className,
    variant: _variant,
    status: _status,
    icon: _icon,
    showIcon: _showIcon,
    size: _size,
    ...rest
  } = props;

  return (
    <span
      className={cn(statusBadgeBaseClasses, statusBadgeToneClasses[tone as StatusTone], className)}
      {...rest}
    >
      {prefix}
      {label}
      {suffix}
    </span>
  );
}

function makeResolve(config: StatusResolverConfig) {
  const emptyVariant = config.emptyVariant ?? 'neutral';
  const fallbackVariant = config.fallbackVariant ?? 'neutral';

  const ruleMap = new Map<string, StatusRule>();
  for (const rule of config.rules) {
    for (const match of rule.matches) {
      ruleMap.set(normalizeStatus(match), rule);
    }
  }

  return function resolve(status: string | undefined | null): ResolvedStatus {
    if (status == null || status.trim() === '') {
      return { variant: emptyVariant, label: '', icon: 'none' };
    }
    const rule = ruleMap.get(normalizeStatus(status));
    if (!rule) {
      return { variant: fallbackVariant, label: autoLabel(status), icon: 'none' };
    }
    return {
      variant: rule.variant,
      label: rule.label ?? autoLabel(status),
      icon: rule.icon ?? 'none',
    };
  };
}

const rawResolve = makeResolve({ rules: [] });

function createBadgeComponent(
  resolve: (status: string | undefined | null) => ResolvedStatus
): FC<StatusBadgeProps> {
  return function StatusBadge(props: StatusBadgeProps) {
    // Legacy tone API: only when neither part of the new contract is used.
    if (props.tone !== undefined && props.variant === undefined && props.status === undefined) {
      return renderLegacyToneBadge(props);
    }

    if (props.variant !== undefined) {
      const label = props.label ?? (props.status !== undefined ? resolve(props.status).label : '');
      return renderBadge({
        props,
        resolved: { variant: props.variant, label, icon: 'none' },
        isEmpty: false,
      });
    }

    const isEmpty = props.status == null || props.status.trim() === '';
    return renderBadge({ props, resolved: resolve(props.status), isEmpty });
  };
}

/**
 * Presentation-only status badge. Pass an explicit `variant` (or the badge
 * renders the neutral fallback). Business status-to-variant mapping belongs in
 * the consuming app via {@link createStatusResolver}.
 */
export const StatusBadge: FC<StatusBadgeProps> = createBadgeComponent(rawResolve);

/**
 * Configure the app's business status map once and get back a preconfigured
 * `StatusBadge` (same props) plus a pure `resolve` function.
 */
export function createStatusResolver(config: StatusResolverConfig): {
  StatusBadge: FC<StatusBadgeProps>;
  resolve: (status: string | undefined | null) => ResolvedStatus;
} {
  const resolve = makeResolve(config);
  return { StatusBadge: createBadgeComponent(resolve), resolve };
}

export default StatusBadge;
