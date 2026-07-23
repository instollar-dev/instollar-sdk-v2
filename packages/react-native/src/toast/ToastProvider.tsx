import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  clearToastHandler,
  setToastHandler,
  type ToastOptions,
  type ToastType,
} from '@instollar-dev/instollar-core';
import { Text } from '../components/Text';
import { useThemeColors } from '../theme/ThemeProvider';

type ToastItem = ToastOptions & { id: number };

export type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const colors = useThemeColors();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    setToastHandler((options) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      setToasts((prev) => [...prev, { ...options, id }]);
      const autoClose = options.autoClose ?? (options.type === 'message' ? 10000 : 5000);
      if (autoClose > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, autoClose);
      }
    });
    return () => clearToastHandler();
  }, []);

  const accentByType = useMemo(
    (): Record<ToastType, string> => ({
      success: colors.primary,
      error: colors.danger,
      warning: colors.destructive,
      info: colors.primary,
      message: colors.brand,
      default: colors.muted,
    }),
    [colors],
  );

  return (
    <View style={styles.root}>
      {children}
      <View pointerEvents="box-none" style={styles.stack}>
        {toasts.map((toast) => {
          const type = toast.type ?? 'default';
          const title = toast.title || type.charAt(0).toUpperCase() + type.slice(1);
          const description = toast.description || toast.message || '';
          return (
            <Pressable
              key={toast.id}
              onPress={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              style={[
                styles.toast,
                {
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  borderLeftColor: accentByType[type],
                },
              ]}
            >
              <Text variant="spline-bold-label">{title}</Text>
              {description ? (
                <Text variant="open-regular-label" muted style={styles.desc}>
                  {description}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  stack: {
    position: 'absolute',
    top: 48,
    left: 16,
    right: 16,
    gap: 8,
    zIndex: 9999,
  },
  toast: {
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: 14,
  },
  desc: { marginTop: 4 },
});
