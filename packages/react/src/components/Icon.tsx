import type { ComponentType, SVGProps } from 'react';
import { cn } from '../utils/cn';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<IconSize, number> = {
  xs: 13,
  sm: 16,
  md: 20,
  lg: 32,
  xl: 48,
};

type IconsaxProps = SVGProps<SVGSVGElement> & {
  size?: string | number;
  color?: string;
  variant?: 'Linear' | 'Outline' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';
};

export interface IconProps {
  icon: ComponentType<IconsaxProps>;
  size?: IconSize;
  color?: 'primary' | 'secondary' | 'muted' | 'inverse' | 'destructive';
  variant?: IconsaxProps['variant'];
  className?: string;
}

const colorClasses = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  muted: 'text-muted',
  inverse: 'text-white',
  destructive: 'text-destructive',
} as const;

export function Icon({
  icon: IconComponent,
  size = 'md',
  color = 'primary',
  variant = 'Linear',
  className,
  ...props
}: IconProps) {
  return (
    <IconComponent
      size={sizeMap[size]}
      variant={variant}
      className={cn(colorClasses[color], className)}
      {...props}
    />
  );
}

/** Curated Iconsax icons re-exported for convenient app imports. */
export {
  // Navigation / chrome
  Home2,
  ArrowLeft2,
  ArrowRight2,
  ArrowDown2,
  ArrowUp2,
  ArrowCircleLeft2,
  ArrowCircleRight2,
  // People / auth
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
  // Actions
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
  // Feedback / status
  InfoCircle,
  Warning2,
  Danger,
  Notification,
  NotificationBing,
  // Time / location
  Calendar,
  Clock,
  Location,
  Gps,
  // Media / files
  Gallery,
  Image,
  DocumentText,
  Folder2,
  // Commerce / work
  Bag2,
  Box1,
  Briefcase,
  Chart,
  Chart21,
  Setting2,
  Setting4,
  Category,
  Menu,
  // Theme
  Sun,
  Sun1,
  Moon,
} from 'iconsax-react';
