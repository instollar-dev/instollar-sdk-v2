import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';
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

  const androidModalProps =
    Platform.OS === 'android'
      ? ({ navigationBarTranslucent: true } as { navigationBarTranslucent?: boolean })
      : undefined;

  return (
    <View style={styles.root}>
      {children}
      {/*
        Host toasts in a transparent Modal so they stack above other RN Modals
        (bottom sheets, selects, confirms). An absolute View cannot sit above a
        Modal window regardless of zIndex. pointerEvents="box-none" keeps empty
        space from eating presses meant for the toast banner only within this
        window — underlying sheets stay non-interactive until the toast dismisses.
      */}
      <Modal
        visible={Boolean(activeToast)}
        transparent
        animationType="none"
        statusBarTranslucent
        presentationStyle="overFullScreen"
        onRequestClose={() => {
          if (activeToast) handleDismiss(activeToast.id);
        }}
        {...androidModalProps}
      >
        <View style={styles.toastLayer} pointerEvents="box-none" collapsable={false}>
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
    zIndex: 9999,
    elevation: 9999,
  },
});
