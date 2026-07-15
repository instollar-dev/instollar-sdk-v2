import { CloseCircle } from 'iconsax-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { iconPaint } from '../utils/iconPaint';

export interface DrawerConfig {
  id: string;
  content: ReactNode;
  /** Rendered as a bold heading in the drawer header. */
  title?: ReactNode;
  /** Extra header content rendered below the title. */
  header?: ReactNode;
  /** Pinned to the bottom of the drawer, outside the scroll area. */
  footer?: ReactNode;
  /** Applied to the drawer panel. */
  className?: string;
  /** Panel width. Default: 'xl'. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Which edge the drawer slides in from. Default: 'right'. */
  side?: 'right' | 'left';
  onClose?: () => void;
  /** Provider default: false — programmatic flows must not be dismissed accidentally. */
  closeOnBackdrop?: boolean;
  /** Provider default: false. */
  closeOnEscape?: boolean;
  /** Default: true (header X). */
  showCloseButton?: boolean;
}

export interface DrawerContextValue {
  openDrawer: (config: Omit<DrawerConfig, 'id'> & { id?: string }) => string;
  /** Closes the TOPMOST drawer. */
  closeDrawer: () => void;
  closeDrawerByID: (id: string) => void;
  closeAll: () => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function useDrawer(): DrawerContextValue {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
}

const EXIT_ANIMATION_MS = 250;

const sizeClasses: Record<NonNullable<DrawerConfig['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
};

interface DrawerShellProps {
  config: DrawerConfig;
  zIndex: number;
  isTopmost: boolean;
  /** When true the panel plays its exit animation before the provider unmounts it. */
  isClosing: boolean;
  onClose: () => void;
}

/** Private internal shell — intentionally NOT exported; the consuming app keeps its own declarative Drawer. */
function DrawerShell({ config, zIndex, isTopmost, isClosing, onClose }: DrawerShellProps) {
  const {
    closeOnBackdrop,
    closeOnEscape,
    showCloseButton,
    size = 'xl',
    side = 'right',
    className,
    title,
    header,
    footer,
  } = config;

  // Mount hidden, then animate in on the next frame.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!closeOnEscape) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !isTopmost) return;
      event.stopPropagation();
      onClose();
    };
    // Capture phase so lower drawers never also see the Escape.
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [closeOnEscape, isTopmost, onClose]);

  if (typeof document === 'undefined') return null;

  const open = entered && !isClosing;
  const hiddenTransform = side === 'right' ? 'translate-x-[110%]' : '-translate-x-[110%]';

  return createPortal(
    <div
      className={cn('fixed inset-0 flex', side === 'right' ? 'justify-end' : 'justify-start')}
      style={{ zIndex }}
      role="presentation"
    >
      <div
        className={cn(
          'absolute inset-0 bg-black/40 backdrop-blur-[5px] transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={() => {
          if (isTopmost && closeOnBackdrop) onClose();
        }}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        className={cn(
          'relative flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-out',
          'md:my-4 md:h-[calc(100dvh-2rem)] md:rounded-3xl',
          side === 'right' ? 'md:mr-4' : 'md:ml-4',
          open ? 'translate-x-0' : hiddenTransform,
          sizeClasses[size],
          className,
        )}
      >
        {title || header || showCloseButton ? (
          <div className="border-b border-black/10 px-6 pb-4 pt-5">
            <div className="flex items-start justify-between gap-4">
              {title ? <h2 className="text-xl font-bold text-foreground">{title}</h2> : <span />}
              {showCloseButton ? (
                <button
                  type="button"
                  aria-label="Close drawer"
                  onClick={onClose}
                  className="cursor-pointer rounded-md p-1 text-muted transition-colors hover:bg-black/5 hover:text-foreground"
                >
                  <CloseCircle size={20} variant="Linear" color={iconPaint.muted} aria-hidden />
                </button>
              ) : null}
            </div>
            {header}
          </div>
        ) : null}
        <div className="min-h-0 flex-1 overflow-y-auto p-6">{config.content}</div>
        {footer ? <div className="border-t border-black/10 bg-white p-4">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}

function generateDrawerId(): string {
  return `drawer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const DrawerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [drawers, setDrawers] = useState<Map<string, DrawerConfig>>(new Map());
  const [drawerOrder, setDrawerOrder] = useState<string[]>([]);
  const [closingIds, setClosingIds] = useState<Set<string>>(new Set());

  // Mirrors let close functions read current state and fire each onClose exactly once,
  // outside React state updaters (which may re-run under StrictMode).
  const drawersRef = useRef(drawers);
  drawersRef.current = drawers;
  const drawerOrderRef = useRef(drawerOrder);
  drawerOrderRef.current = drawerOrder;
  const closingIdsRef = useRef(closingIds);
  closingIdsRef.current = closingIds;
  const exitTimersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const timers = exitTimersRef.current;
    return () => {
      for (const timer of timers.values()) clearTimeout(timer);
    };
  }, []);

  const openDrawer = useCallback(
    (config: Omit<DrawerConfig, 'id'> & { id?: string }): string => {
      const id = config.id || generateDrawerId();
      const resolved: DrawerConfig = {
        ...config,
        id,
        closeOnBackdrop: config.closeOnBackdrop ?? false,
        closeOnEscape: config.closeOnEscape ?? false,
        showCloseButton: config.showCloseButton ?? true,
      };
      // Re-opening an id that is mid-exit cancels the pending removal.
      const exitTimer = exitTimersRef.current.get(id);
      if (exitTimer) {
        clearTimeout(exitTimer);
        exitTimersRef.current.delete(id);
        const nextClosing = new Set(closingIdsRef.current);
        nextClosing.delete(id);
        closingIdsRef.current = nextClosing;
        setClosingIds(nextClosing);
      }
      const nextDrawers = new Map(drawersRef.current);
      nextDrawers.set(id, resolved);
      drawersRef.current = nextDrawers;
      setDrawers(nextDrawers);
      // Re-opening an existing id replaces its config without duplicating it in the order.
      const nextOrder = drawerOrderRef.current.includes(id)
        ? drawerOrderRef.current
        : [...drawerOrderRef.current, id];
      drawerOrderRef.current = nextOrder;
      setDrawerOrder(nextOrder);
      return id;
    },
    [],
  );

  const removeDrawer = useCallback((id: string) => {
    const config = drawersRef.current.get(id);
    if (!config || closingIdsRef.current.has(id)) return;
    // Start the exit animation now; unmount and fire onClose once it finishes.
    const nextClosing = new Set(closingIdsRef.current);
    nextClosing.add(id);
    closingIdsRef.current = nextClosing;
    setClosingIds(nextClosing);
    const timer = setTimeout(() => {
      exitTimersRef.current.delete(id);
      const currentConfig = drawersRef.current.get(id);
      const nextDrawers = new Map(drawersRef.current);
      nextDrawers.delete(id);
      const nextOrder = drawerOrderRef.current.filter((entry) => entry !== id);
      const remainingClosing = new Set(closingIdsRef.current);
      remainingClosing.delete(id);
      // Update mirrors before invoking user code so repeated close attempts cannot
      // fire onClose more than once.
      drawersRef.current = nextDrawers;
      drawerOrderRef.current = nextOrder;
      closingIdsRef.current = remainingClosing;
      currentConfig?.onClose?.();
      setDrawers(nextDrawers);
      setDrawerOrder(nextOrder);
      setClosingIds(remainingClosing);
    }, EXIT_ANIMATION_MS);
    exitTimersRef.current.set(id, timer);
  }, []);

  const closeDrawerByID = useCallback((id: string) => removeDrawer(id), [removeDrawer]);

  const closeDrawer = useCallback(() => {
    // Topmost drawer that is not already animating out.
    for (let index = drawerOrderRef.current.length - 1; index >= 0; index -= 1) {
      const id = drawerOrderRef.current[index];
      if (!closingIdsRef.current.has(id)) {
        removeDrawer(id);
        return;
      }
    }
  }, [removeDrawer]);

  const closeAll = useCallback(() => {
    for (const id of [...drawerOrderRef.current]) {
      removeDrawer(id);
    }
  }, [removeDrawer]);

  useEffect(() => {
    if (drawerOrder.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [drawerOrder.length]);

  const contextValue = useMemo<DrawerContextValue>(
    () => ({
      openDrawer,
      closeDrawer,
      closeDrawerByID,
      closeAll,
    }),
    [openDrawer, closeDrawer, closeDrawerByID, closeAll],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      {children}
      {drawerOrder.map((id, index) => {
        const config = drawers.get(id);
        if (!config) return null;
        return (
          <DrawerShell
            key={id}
            config={config}
            zIndex={100 + index * 10}
            isTopmost={index === drawerOrder.length - 1}
            isClosing={closingIds.has(id)}
            onClose={() => closeDrawerByID(id)}
          />
        );
      })}
    </DrawerContext.Provider>
  );
};

export default DrawerProvider;
