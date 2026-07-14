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

export { Home2, User, Lock, ArrowRight2, TickCircle, CloseCircle } from 'iconsax-react';
