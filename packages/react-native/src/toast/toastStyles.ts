import type { ToastType } from '@instollar-dev/instollar-core';
import type { ComponentType } from 'react';
import { Danger, InfoCircle, TickCircle, Warning2 } from '../components/Icon';

type IconsaxProps = {
  size?: string | number;
  color?: string;
  variant?: 'Linear' | 'Outline' | 'Broken' | 'Bold' | 'Bulk' | 'TwoTone';
};

export type ToastPalette = {
  backgroundColor: string;
  foregroundColor: string;
  mutedColor: string;
  progressTrack: string;
  icon: ComponentType<IconsaxProps>;
};

const PALETTES: Record<ToastType, ToastPalette> = {
  success: {
    backgroundColor: '#0F973D',
    foregroundColor: '#FFFFFF',
    mutedColor: 'rgba(255, 255, 255, 0.88)',
    progressTrack: 'rgba(255, 255, 255, 0.35)',
    icon: TickCircle,
  },
  error: {
    backgroundColor: '#DC2626',
    foregroundColor: '#FFFFFF',
    mutedColor: 'rgba(255, 255, 255, 0.88)',
    progressTrack: 'rgba(255, 255, 255, 0.35)',
    icon: Danger,
  },
  warning: {
    backgroundColor: '#F49E0C',
    foregroundColor: '#012B15',
    mutedColor: 'rgba(1, 43, 21, 0.82)',
    progressTrack: 'rgba(1, 43, 21, 0.22)',
    icon: Warning2,
  },
  info: {
    backgroundColor: '#012B15',
    foregroundColor: '#FFFFFF',
    mutedColor: 'rgba(255, 255, 255, 0.88)',
    progressTrack: 'rgba(255, 255, 255, 0.35)',
    icon: InfoCircle,
  },
  message: {
    backgroundColor: '#012B15',
    foregroundColor: '#FFFFFF',
    mutedColor: 'rgba(255, 255, 255, 0.88)',
    progressTrack: 'rgba(255, 255, 255, 0.35)',
    icon: InfoCircle,
  },
  default: {
    backgroundColor: '#374151',
    foregroundColor: '#FFFFFF',
    mutedColor: 'rgba(255, 255, 255, 0.88)',
    progressTrack: 'rgba(255, 255, 255, 0.35)',
    icon: InfoCircle,
  },
};

export function getToastPalette(type: ToastType | undefined): ToastPalette {
  return PALETTES[type ?? 'default'];
}
