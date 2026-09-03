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
import { StyleSheet, View } from 'react-native';
import {
  clearToastHandler,
  setToastHandler,
  type ToastOptions,
} from '@instollar-dev/instollar-core';
import { triggerHapticFeedback } from '../utils/haptics';
import { ToastBanner, getDefaultToastTopInset, type ToastBannerItem } from './ToastBanner';

export type ToastProviderProps = {
  children: ReactNode;
  /** Safe-area top inset from the host app (e.g. `useSafeAreaInsets().top`). */
  topInset?: number;
};

type ToastContextValue = {
  activeToast: ToastBannerItem | null;
  topInset: number;
  onDismiss: (id: number) => void;
  /** RN Modal windows block the root overlay — hosts register while a modal is open. */
  registerModalHost: () => () => void;
  modalHostCount: number;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function useToastContext(): ToastContextValue | null {
  return useContext(ToastContext);
}

/**
 * Renders the active toast. Mount inside RN `Modal` / sheet windows so toasts
 * stay visible above them. Pass-through empty space stays interactive.
 */
export function ToastHost({ topInset }: { topInset?: number } = {}) {
  const ctx = useToastContext();

  useEffect(() => {
    if (!ctx) return;
    return ctx.registerModalHost();
  }, [ctx]);

  if (!ctx?.activeToast) return null;

  return (
    <View style={styles.toastLayer} pointerEvents="box-none" collapsable={false}>
      <ToastBanner
        toast={ctx.activeToast}
        topInset={topInset ?? ctx.topInset}
        onDismiss={ctx.onDismiss}
      />
    </View>
  );
}

export function ToastProvider({ children, topInset }: ToastProviderProps) {
  const resolvedTopInset = topInset ?? getDefaultToastTopInset();
  const [activeToast, setActiveToast] = useState<ToastBannerItem | null>(null);
  const [modalHostCount, setModalHostCount] = useState(0);
  const idRef = useRef(0);

  const enqueueToast = useCallback((options: ToastOptions) => {
    const type = options.type ?? 'default';
    if (type === 'success') triggerHapticFeedback('success');
    else if (type === 'error') triggerHapticFeedback('error');
    else if (type === 'warning') triggerHapticFeedback('warning');
    else if (type === 'message' || type === 'info') triggerHapticFeedback('light');

    idRef.current += 1;
    setActiveToast({
      ...options,
      id: idRef.current,
    });
  }, []);

  const handleDismiss = useCallback((id: number) => {
    setActiveToast((current) => (current?.id === id ? null : current));
  }, []);

  const registerModalHost = useCallback(() => {
    setModalHostCount((count) => count + 1);
    return () => setModalHostCount((count) => Math.max(0, count - 1));
  }, []);

  useEffect(() => {
    setToastHandler(enqueueToast);
    return () => clearToastHandler();
  }, [enqueueToast]);

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      activeToast,
      topInset: resolvedTopInset,
      onDismiss: handleDismiss,
      registerModalHost,
      modalHostCount,
    }),
    [activeToast, resolvedTopInset, handleDismiss, registerModalHost, modalHostCount],
  );

  // Absolute overlay (not RN Modal) so empty space does not block touches.
  // When a modal host is mounted, that window owns the toast instead.
  const showRootToast = Boolean(activeToast) && modalHostCount === 0;

  return (
    <ToastContext.Provider value={contextValue}>
      <View style={styles.root}>
        {children}
        {showRootToast ? (
          <View style={styles.toastLayer} pointerEvents="box-none" collapsable={false}>
            <ToastBanner
              toast={activeToast!}
              topInset={resolvedTopInset}
              onDismiss={handleDismiss}
            />
          </View>
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  toastLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999,
    elevation: 9999,
  },
});
