import { More } from 'iconsax-react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { cn } from '../utils/cn';
import { iconPaint } from '../utils/iconPaint';

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  className?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /**
   * Opaque permission key. The SDK does not implement auth — if present and
   * `renderPermissionGate` is set, the item is wrapped with that gate.
   */
  permission?: string;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  items: DropdownMenuItem[];
  /** Icon inside the default trigger. Ignored when `trigger` is set. */
  icon?: ReactNode;
  /** Fully custom trigger — replaces the default button+icon. */
  trigger?: ReactNode;
  className?: string;
  menuClassName?: string;
  position?: 'top' | 'bottom';
  align?: 'start' | 'end';
  offset?: number;
  renderPermissionGate?: (permission: string, children: ReactNode) => ReactNode;
}

export const DropdownMenu: FC<DropdownMenuProps> = ({
  items,
  icon,
  trigger,
  className,
  menuClassName,
  position: preferredPosition = 'bottom',
  align = 'start',
  offset = 4,
  renderPermissionGate,
}) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    left: number;
  } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useOnClickOutside(menuRef, (event) => {
    if (triggerRef.current?.contains(event.target as Node)) return;
    close();
  });

  useEffect(() => {
    if (!open) return;
    const onScroll = () => close();
    window.addEventListener('scroll', onScroll, true);
    return () => window.removeEventListener('scroll', onScroll, true);
  }, [open, close]);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) {
      setCoords(null);
      return;
    }

    const triggerEl =
      (triggerRef.current.querySelector('button') as HTMLElement | null) ?? triggerRef.current;
    const rect = triggerEl.getBoundingClientRect();
    const menuHeight = menuRef.current?.offsetHeight ?? items.length * 45 + 16;
    const menuWidth = menuRef.current?.offsetWidth ?? 200;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let finalPosition = preferredPosition;
    if (
      preferredPosition === 'bottom' &&
      spaceBelow < menuHeight + offset &&
      spaceAbove > spaceBelow
    ) {
      finalPosition = 'top';
    } else if (
      preferredPosition === 'top' &&
      spaceAbove < menuHeight + offset &&
      spaceBelow > spaceAbove
    ) {
      finalPosition = 'bottom';
    }

    const left =
      align === 'end'
        ? Math.max(10, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 10))
        : Math.max(10, Math.min(rect.left, window.innerWidth - menuWidth - 10));

    if (finalPosition === 'bottom') {
      setCoords({ top: rect.bottom + offset, left });
    } else {
      setCoords({ bottom: window.innerHeight - rect.top + offset, left });
    }
  }, [align, preferredPosition, open, items.length, offset]);

  const defaultIcon = (
    <More size={20} variant="Linear" color={iconPaint.foreground} aria-hidden />
  );

  return (
    <div className={cn('inline-block', className)} ref={triggerRef}>
      <div
        className="cursor-pointer"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        {trigger ?? (
          <button
            type="button"
            className="cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-foreground/5"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            {icon ?? defaultIcon}
          </button>
        )}
      </div>

      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              className={cn(
                'fixed z-[100] max-w-xs min-w-[180px] w-max overflow-hidden rounded-lg border border-border bg-background text-foreground shadow-lg',
                menuClassName,
              )}
              style={
                coords
                  ? {
                      ...(coords.top !== undefined ? { top: coords.top } : {}),
                      ...(coords.bottom !== undefined ? { bottom: coords.bottom } : {}),
                      left: coords.left,
                      visibility: 'visible',
                    }
                  : { visibility: 'hidden', top: 0, left: 0 }
              }
              onClick={(event) => event.stopPropagation()}
            >
              {items.map((item, index) => {
                const button = (
                  <button
                    type="button"
                    role="menuitem"
                    disabled={item.disabled}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 px-4 py-3 text-sm text-foreground transition-colors',
                      item.disabled
                        ? 'cursor-not-allowed opacity-50 grayscale'
                        : 'cursor-pointer hover:bg-foreground/5',
                      item.className,
                    )}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (item.disabled) return;
                      item.onClick();
                      close();
                    }}
                  >
                    {item.prefix ? <span className="shrink-0">{item.prefix}</span> : null}
                    <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                    {item.suffix ? <span className="shrink-0">{item.suffix}</span> : null}
                  </button>
                );

                if (item.permission && renderPermissionGate) {
                  return (
                    <div key={index}>{renderPermissionGate(item.permission, button)}</div>
                  );
                }
                return <div key={index}>{button}</div>;
              })}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
};

export default DropdownMenu;
