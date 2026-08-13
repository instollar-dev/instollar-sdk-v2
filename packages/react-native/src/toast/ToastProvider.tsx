import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
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
        Host toasts in their own transparent Modal so they stack above other
        Modals (bottom sheets, dialogs). Absolute overlays in the app tree sit
        under RN Modal windows and get dimmed by sheet backdrops.
      */}
      <Modal
        visible={activeToast != null}
        transparent
        animationType="none"
        statusBarTranslucent
        presentationStyle="overFullScreen"
        onRequestClose={() => {
          if (activeToast) handleDismiss(activeToast.id);
        }}>
        <View style={styles.toastLayer} pointerEvents="box-none">
          {activeToast ? (
            <ToastBanner
              toast={activeToast}
              topInset={resolvedTopInset}
              onDismiss={handleDismiss}
            />
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  toastLayer: {
    flex: 1,
  },
});