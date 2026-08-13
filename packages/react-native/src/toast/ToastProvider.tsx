import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
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

export function ToastProvider({ children, topInset }: ToastProviderProps) {
  const resolvedTopInset = topInset ?? getDefaultToastTopInset();
  const [activeToast, setActiveToast] = useState<ToastBannerItem | null>(null);
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

  useEffect(() => {
    setToastHandler(enqueueToast);
    return () => clearToastHandler();
  }, [enqueueToast]);

  return (
    <View style={styles.root}>
      {children}
      {/*
        Absolute overlay (not Modal) so empty space stays pressable.
        pointerEvents="box-none" lets taps pass through to the app; only the
        banner itself captures touches. Sheets that use RN Modal may still
        cover toasts while open — prefer dismissing the sheet first.
      */}
      {activeToast ? (
        <View style={styles.toastLayer} pointerEvents="box-none">
          <ToastBanner
            toast={activeToast}
            topInset={resolvedTopInset}
            onDismiss={handleDismiss}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  toastLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 9999,
    elevation: 9999,
  },
});
