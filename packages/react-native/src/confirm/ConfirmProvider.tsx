import {
  clearConfirmHandler,
  setConfirmHandler,
  type ConfirmOptions,
} from '@instollar-dev/instollar-core';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConfirmSheet } from '../components/ConfirmSheet';

/** Same Android soft-nav floor as `Sheet` — host insets are more reliable than Modal ones. */
const ANDROID_NAV_MIN = 56;

type PendingConfirm = ConfirmOptions & {
  id: number;
  resolve: (confirmed: boolean) => void;
};

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

function defaultDismissible(options: ConfirmOptions): boolean {
  if (options.dismissible != null) return options.dismissible;
  const variant = options.variant ?? 'default';
  return variant !== 'danger' && variant !== 'warning';
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const idRef = useRef(0);
  const hostBottomInset = Math.max(
    insets.bottom,
    Platform.OS === 'android' ? ANDROID_NAV_MIN : 16,
  );

  const finish = useCallback((confirmed: boolean) => {
    setPending((current) => {
      current?.resolve(confirmed);
      return null;
    });
  }, []);

  const showConfirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      idRef.current += 1;
      setPending({
        ...options,
        id: idRef.current,
        resolve,
      });
    });
  }, []);

  useEffect(() => {
    setConfirmHandler(showConfirm);
    return () => clearConfirmHandler();
  }, [showConfirm]);

  const contextValue = useMemo(
    () => ({ confirm: showConfirm }),
    [showConfirm],
  );

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      {pending ? (
        <ConfirmSheet
          open
          title={pending.title}
          description={pending.description}
          confirmLabel={pending.confirmLabel}
          cancelLabel={pending.cancelLabel}
          variant={pending.variant}
          icon={pending.icon}
          dismissible={defaultDismissible(pending)}
          bottomInset={hostBottomInset}
          onClose={() => finish(false)}
          onCancel={() => finish(false)}
          onConfirm={() => finish(true)}
        />
      ) : null}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmContextValue {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return ctx;
}
