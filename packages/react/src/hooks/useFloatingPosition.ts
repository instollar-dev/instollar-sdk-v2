import { useCallback, useLayoutEffect, useState, type RefObject } from 'react';

export type FloatingPlacement = 'top' | 'bottom';

export interface FloatingPosition {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
  placement: FloatingPlacement;
}

const DROPDOWN_GAP = 4;
const VIEWPORT_PADDING = 8;
const DEFAULT_MAX_HEIGHT = 224;
const MIN_DROPDOWN_HEIGHT = 80;

export function useFloatingPosition(
  anchorRef: RefObject<HTMLElement | null>,
  open: boolean,
  maxHeight = DEFAULT_MAX_HEIGHT,
) {
  const [position, setPosition] = useState<FloatingPosition | null>(null);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;
    const spaceAbove = rect.top - VIEWPORT_PADDING;

    // Flip upward when the full menu wouldn't fit below and top has more space
    const shouldFlipUp = spaceBelow < maxHeight && spaceAbove > spaceBelow;

    const placement: FloatingPlacement = shouldFlipUp ? 'top' : 'bottom';
    const availableSpace = placement === 'bottom' ? spaceBelow : spaceAbove;
    const resolvedMaxHeight = Math.max(
      MIN_DROPDOWN_HEIGHT,
      Math.min(maxHeight, availableSpace - DROPDOWN_GAP),
    );

    let left = rect.left;
    const width = rect.width;
    if (left + width > window.innerWidth - VIEWPORT_PADDING) {
      left = window.innerWidth - width - VIEWPORT_PADDING;
    }
    left = Math.max(VIEWPORT_PADDING, left);

    setPosition({
      left,
      width,
      maxHeight: resolvedMaxHeight,
      placement,
      ...(placement === 'bottom'
        ? { top: rect.bottom + DROPDOWN_GAP, bottom: undefined }
        : { bottom: window.innerHeight - rect.top + DROPDOWN_GAP, top: undefined }),
    });
  }, [anchorRef, maxHeight]);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    updatePosition();
    const raf = requestAnimationFrame(updatePosition);

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, updatePosition]);

  return position;
}
