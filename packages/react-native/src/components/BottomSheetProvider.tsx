import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheet } from './BottomSheet';

export type BottomSheetConfig = {
  id: string;
  content: ReactNode;
  title?: string;
  footer?: ReactNode;
  /** Sheet height snap points. Default: `['50%', '90%']`. */
  snapPoints?: (string | number)[];
  index?: number;
  showCloseButton?: boolean;
  /** Default: true */
  closeOnBackdrop?: boolean;
  /** Default: true */
  enablePanDownToClose?: boolean;
  /** Default: true */
  scrollable?: boolean;
  onClose?: () => void;
};

type SheetEntry = BottomSheetConfig & { open: boolean };

export type BottomSheetContextValue = {
  openBottomSheet: (config: Omit<BottomSheetConfig, 'id'> & { id?: string }) => string;
  /** Closes the topmost sheet (animates out). */
  closeBottomSheet: () => void;
  closeBottomSheetByID: (id: string) => void;
  closeAll: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

export function useBottomSheet(): BottomSheetContextValue {
  const ctx = useContext(BottomSheetContext);
  if (!ctx) {
    throw new Error(
      '[instollar-react-native] useBottomSheet must be used within BottomSheetProvider',
    );
  }
  return ctx;
}

export type BottomSheetProviderProps = {
  children: ReactNode;
  /**
   * When true (default), wraps children in GestureHandlerRootView.
   * Set false if the host app already provides one at the root (e.g. Expo Router).
   */
  wrapGestureHandler?: boolean;
};

let sheetSeq = 0;

/**
 * Required once near the app root for declarative + programmatic BottomSheet.
 * Place inside ThemeProvider (and usually beside ToastProvider).
 *
 * @example
 * const { openBottomSheet, closeBottomSheet } = useBottomSheet();
 * openBottomSheet({
 *   title: 'Confirm',
 *   content: <Text>…</Text>,
 *   snapPoints: ['40%'],
 * });
 */
export function BottomSheetProvider({
  children,
  wrapGestureHandler = true,
}: BottomSheetProviderProps) {
  const [stack, setStack] = useState<SheetEntry[]>([]);

  /** Start dismiss animation; sheet is removed after `onDismiss`. */
  const requestCloseByID = useCallback((id: string) => {
    setStack((prev) =>
      prev.map((s) => (s.id === id ? { ...s, open: false } : s)),
    );
  }, []);

  const removeSheet = useCallback((id: string) => {
    setStack((prev) => {
      const target = prev.find((s) => s.id === id);
      if (target?.onClose) {
        setTimeout(() => target.onClose?.(), 0);
      }
      return prev.filter((s) => s.id !== id);
    });
  }, []);

  const closeBottomSheetByID = useCallback(
    (id: string) => {
      requestCloseByID(id);
    },
    [requestCloseByID],
  );

  const closeBottomSheet = useCallback(() => {
    setStack((prev) => {
      if (prev.length === 0) return prev;
      const top = prev[prev.length - 1]!;
      return prev.map((s) => (s.id === top.id ? { ...s, open: false } : s));
    });
  }, []);

  const closeAll = useCallback(() => {
    setStack((prev) => prev.map((s) => ({ ...s, open: false })));
  }, []);

  const openBottomSheet = useCallback(
    (config: Omit<BottomSheetConfig, 'id'> & { id?: string }) => {
      const id = config.id ?? `instollar-sheet-${++sheetSeq}`;
      setStack((prev) => {
        const withoutDup = prev.filter((s) => s.id !== id);
        return [...withoutDup, { ...config, id, open: true }];
      });
      return id;
    },
    [],
  );

  const value = useMemo<BottomSheetContextValue>(
    () => ({
      openBottomSheet,
      closeBottomSheet,
      closeBottomSheetByID,
      closeAll,
    }),
    [openBottomSheet, closeBottomSheet, closeBottomSheetByID, closeAll],
  );

  const content = (
    <BottomSheetModalProvider>
      <BottomSheetContext.Provider value={value}>
        {children}
        {stack.map((sheet) => (
          <BottomSheet
            key={sheet.id}
            open={sheet.open}
            title={sheet.title}
            footer={sheet.footer}
            snapPoints={sheet.snapPoints}
            index={sheet.index}
            showCloseButton={sheet.showCloseButton}
            closeOnBackdrop={sheet.closeOnBackdrop}
            enablePanDownToClose={sheet.enablePanDownToClose}
            scrollable={sheet.scrollable}
            onClose={() => removeSheet(sheet.id)}
          >
            {sheet.content}
          </BottomSheet>
        ))}
      </BottomSheetContext.Provider>
    </BottomSheetModalProvider>
  );

  if (!wrapGestureHandler) return content;

  return (
    <GestureHandlerRootView style={styles.root}>{content}</GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
