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

export interface ModalConfig {
  id: string;
  content: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  onClose?: () => void;
  /** Provider default: false — programmatic flows must not be dismissed accidentally. */
  closeOnBackdrop?: boolean;
  /** Provider default: false. */
  closeOnEscape?: boolean;
  /** Default: true (header X). */
  showCloseButton?: boolean;
}

export interface ModalContextValue {
  openModal: (config: Omit<ModalConfig, 'id'> & { id?: string }) => string;
  /** Closes the TOPMOST modal. */
  closeModal: () => void;
  closeModalByID: (id: string) => void;
  closeAll: () => void;
  /** @deprecated alias of closeModalByID — keep for source compatibility */
  closeByID: (id: string) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal(): ModalContextValue {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

const sizeClasses: Record<NonNullable<ModalConfig['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  full: 'max-w-full',
};

interface ModalShellProps {
  config: ModalConfig;
  zIndex: number;
  isTopmost: boolean;
  onClose: () => void;
}

/** Private internal shell — intentionally NOT exported; the consuming app keeps its own declarative Modal. */
function ModalShell({ config, zIndex, isTopmost, onClose }: ModalShellProps) {
  const { closeOnBackdrop, closeOnEscape, showCloseButton, size = '2xl', className } = config;

  useEffect(() => {
    if (!closeOnEscape) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !isTopmost) return;
      event.stopPropagation();
      onClose();
    };
    // Capture phase so lower modals never also see the Escape.
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [closeOnEscape, isTopmost, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-6"
      style={{ zIndex }}
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[5px]"
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
          'relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl',
          sizeClasses[size],
          className,
        )}
      >
        {showCloseButton ? (
          <div className="flex justify-end px-4 pt-4">
            <button
              type="button"
              aria-label="Close modal"
              onClick={onClose}
              className="cursor-pointer rounded-md p-1 text-muted transition-colors hover:bg-black/5 hover:text-foreground"
            >
              <CloseCircle size={20} variant="Linear" color={iconPaint.muted} aria-hidden />
            </button>
          </div>
        ) : null}
        <div className="min-h-0 overflow-y-auto p-8">{config.content}</div>
      </div>
    </div>,
    document.body,
  );
}

function generateModalId(): string {
  return `modal-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<Map<string, ModalConfig>>(new Map());
  const [modalOrder, setModalOrder] = useState<string[]>([]);

  // Mirrors let close functions read current state and fire each onClose exactly once,
  // outside React state updaters (which may re-run under StrictMode).
  const modalsRef = useRef(modals);
  modalsRef.current = modals;
  const modalOrderRef = useRef(modalOrder);
  modalOrderRef.current = modalOrder;

  const openModal = useCallback(
    (config: Omit<ModalConfig, 'id'> & { id?: string }): string => {
      const id = config.id || generateModalId();
      const resolved: ModalConfig = {
        ...config,
        id,
        closeOnBackdrop: config.closeOnBackdrop ?? false,
        closeOnEscape: config.closeOnEscape ?? false,
        showCloseButton: config.showCloseButton ?? true,
      };
      const nextModals = new Map(modalsRef.current);
      nextModals.set(id, resolved);
      modalsRef.current = nextModals;
      setModals(nextModals);
      // Re-opening an existing id replaces its config without duplicating it in the order.
      const nextOrder = modalOrderRef.current.includes(id)
        ? modalOrderRef.current
        : [...modalOrderRef.current, id];
      modalOrderRef.current = nextOrder;
      setModalOrder(nextOrder);
      return id;
    },
    [],
  );

  const removeModal = useCallback((id: string) => {
    const config = modalsRef.current.get(id);
    if (!config) return;
    const nextModals = new Map(modalsRef.current);
    nextModals.delete(id);
    const nextOrder = modalOrderRef.current.filter((entry) => entry !== id);
    // Update mirrors before invoking user code so repeated close attempts cannot
    // fire onClose more than once.
    modalsRef.current = nextModals;
    modalOrderRef.current = nextOrder;
    config.onClose?.();
    setModals(nextModals);
    setModalOrder(nextOrder);
  }, []);

  const closeModalByID = useCallback((id: string) => removeModal(id), [removeModal]);

  const closeModal = useCallback(() => {
    const topId = modalOrderRef.current[modalOrderRef.current.length - 1];
    if (topId === undefined) return;
    removeModal(topId);
  }, [removeModal]);

  const closeAll = useCallback(() => {
    const currentOrder = modalOrderRef.current;
    const currentModals = modalsRef.current;
    modalsRef.current = new Map();
    modalOrderRef.current = [];
    for (const id of currentOrder) {
      currentModals.get(id)?.onClose?.();
    }
    setModals(new Map());
    setModalOrder([]);
  }, []);

  useEffect(() => {
    if (modalOrder.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [modalOrder.length]);

  const contextValue = useMemo<ModalContextValue>(
    () => ({
      openModal,
      closeModal,
      closeModalByID,
      closeAll,
      closeByID: closeModalByID,
    }),
    [openModal, closeModal, closeModalByID, closeAll],
  );

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      {modalOrder.map((id, index) => {
        const config = modals.get(id);
        if (!config) return null;
        return (
          <ModalShell
            key={id}
            config={config}
            zIndex={100 + index * 10}
            isTopmost={index === modalOrder.length - 1}
            onClose={() => closeModalByID(id)}
          />
        );
      })}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
