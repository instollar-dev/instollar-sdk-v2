import type { ComponentType } from 'react';
import { useThemeColors } from '../theme/ThemeProvider';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconColor =
  | 'current'
  | 'brand'
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'inverse'
  | 'destructive'
  | 'danger';

const sizeMap: Record<IconSize, number> = {
  xs: 13,
  sm: 16,
  md: 20,
  lg: 32,
  xl: 48,
};

type IconsaxProps = {
  size?: string | number;
  color?: string;
  variant?: 'Linear' | 'Outline' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';
};

export type IconProps = {
  icon: ComponentType<IconsaxProps>;
  size?: IconSize;
  color?: IconColor;
  variant?: IconsaxProps['variant'];
};

export function Icon({
  icon: IconComponent,
  size = 'md',
  color = 'current',
  variant = 'Linear',
}: IconProps) {
  const colors = useThemeColors();
  const colorValues: Record<IconColor, string> = {
    current: colors.fg,
    brand: colors.brand,
    primary: colors.primary,
    secondary: colors.secondary,
    muted: colors.muted,
    inverse: colors.white,
    destructive: colors.destructive,
    danger: colors.danger,
  };

  return (
    <IconComponent size={sizeMap[size]} variant={variant} color={colorValues[color]} />
  );
}

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
  Element3,
  TextalignLeft,
  Menu,
  Sun,
  Sun1,
  Moon,
} from 'iconsax-react-native';
