import { useEffect, type RefObject } from 'react';

type RefTarget = RefObject<HTMLElement | null>;

export function useClickOutside(
  refs: RefTarget | RefTarget[],
  handler: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const refList = Array.isArray(refs) ? refs : [refs];

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const isInside = refList.some((ref) => ref.current?.contains(target));
      if (isInside) return;
      handler();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [refs, handler, enabled]);
}
