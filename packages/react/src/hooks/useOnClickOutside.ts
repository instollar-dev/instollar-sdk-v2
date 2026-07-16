import { useEffect, type RefObject } from 'react';

/**
 * Prompt 0 / DropdownMenu contract: single-ref outside click with the event
 * passed to the handler. Prefer this for portal menus that need to ignore
 * clicks on a separate trigger ref.
 *
 * For multi-ref close (Select, Table pagination), use `useClickOutside`.
 */
export function useOnClickOutside<T extends HTMLElement | null = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
): void {
  useEffect(() => {
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (ref.current?.contains(target)) return;
      handler(event);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [ref, handler]);
}
