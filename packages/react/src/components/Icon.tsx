import type { ComponentType, SVGProps } from 'react';
import { cn } from '../utils/cn';
import { iconPaint, type IconPaint } from '../utils/iconPaint';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<IconSize, number> = {
  xs: 13,
  sm: 16,
  md: 20,
  lg: 32,
  xl: 48,
};

/** Resolved paint values — Iconsax uses the `color` prop (fill/stroke), not CSS `currentColor` alone. */
export type IconColor = Exclude<IconPaint, 'foreground'>;

const colorValues: Record<IconColor, string> = {
  current: iconPaint.current,
  brand: iconPaint.brand,
  primary: iconPaint.primary,
  secondary: iconPaint.secondary,
  muted: iconPaint.muted,
  inverse: iconPaint.inverse,
  destructive: iconPaint.destructive,
};

type IconsaxProps = SVGProps<SVGSVGElement> & {
  size?: string | number;
  color?: string;
  variant?: 'Linear' | 'Outline' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';
};

export interface IconProps {
  icon: ComponentType<IconsaxProps>;
  size?: IconSize;
  /**
   * Paint color for the SVG.
   * Default `current` inherits the parent (e.g. Button label).
   * Prefer this over `primary` on solid brand buttons so icons stay visible.
   */
  color?: IconColor;
  variant?: IconsaxProps['variant'];
  className?: string;
}

export function Icon({
  icon: IconComponent,
  size = 'md',
  color = 'current',
  variant = 'Linear',
  className,
  ...props
}: IconProps) {
  return (
    <IconComponent
      size={sizeMap[size]}
      variant={variant}
      color={colorValues[color]}
      className={cn('inline-block shrink-0', className)}
      aria-hidden
      {...props}
    />
  );
}

/** Curated Iconsax icons re-exported for convenient app imports. */
export {
  Home2,
  ArrowLeft2,
  ArrowRight2,
  ArrowDown2,
  ArrowUp2,
  ArrowCircleLeft2,
  ArrowCircleRight2,
  User,
  UserAdd,
  Profile2User,
  People,
  Login,
  Logout,
  Lock,
  Unlock,
  Eye,
  EyeSlash,
  ShieldTick,
  SecuritySafe,
  Add,
  AddCircle,
  Minus,
  CloseCircle,
  TickCircle,
  TickSquare,
  Trash,
  Edit2,
  Copy,
  DocumentDownload,
  DocumentUpload,
  Send2,
  Refresh,
  SearchNormal1,
  Filter,
  More,
  More2,
  InfoCircle,
  Warning2,
  Danger,
  Notification,
  NotificationBing,
  Calendar,
  Clock,
  Location,
  Gps,
  Gallery,
  Image,
  DocumentText,
  Folder2,
  Bag2,
  Box1,
  Briefcase,
  Chart,
  Chart21,
  Setting2,
  Setting4,
  Category,
  Menu,
  Sun,
  Sun1,
  Moon,
} from 'iconsax-react';
