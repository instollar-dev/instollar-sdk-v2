import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import { Text } from './Text';
import { CloseCircle } from './Icon';
import { useThemeColors } from '../theme/ThemeProvider';
import { triggerHapticFeedback } from '../utils/haptics';

export type BottomSheetProps = {
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  /** Sheet height snap points. Default: `['50%', '90%']`. */
  snapPoints?: (string | number)[];
  /** Initial snap index when presented. Default: 0. */
  index?: number;
  title?: string;
  /** Optional footer pinned below scrollable content. */
  footer?: ReactNode;
  /** Show header close button. Default: true when `title` is set, else false. */
  showCloseButton?: boolean;
  /** Close when tapping the dimmed backdrop. Default: true. */
  closeOnBackdrop?: boolean;
  /** Enable pan-down to close. Default: true. */
  enablePanDownToClose?: boolean;
  /**
   * Wrap children in BottomSheetScrollView. Default: true.
   * Ignored when `contentMode` is set.
   */
  scrollable?: boolean;
  /**
   * How children are wrapped inside the modal:
   * - `scroll` — BottomSheetScrollView (forms / short content)
   * - `view` — BottomSheetView
   * - `raw` — no wrapper (required for BottomSheetFlatList as a direct child)
   *
   * Default: `scroll` when `scrollable`, else `view`.
   */
  contentMode?: 'scroll' | 'view' | 'raw';
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Gorhom's content-based auto-sizing. Default: **false** — we always pass
   * explicit `snapPoints`, and dynamic sizing can mis-measure scrollable
   * content (e.g. a searchable list), collapsing it to an empty-looking sheet.
   */
  enableDynamicSizing?: boolean;
  /** Extra props forwarded to BottomSheetModal. */
  modalProps?: Omit<
    BottomSheetModalProps,
    | 'children'
    | 'snapPoints'
    | 'index'
    | 'onDismiss'
    | 'enablePanDownToClose'
    | 'backdropComponent'
    | 'enableDynamicSizing'
  >;
};

export const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
  function BottomSheet(
    {
      open,
      onClose,
      children,
      snapPoints: snapPointsProp,
      index = 0,
      title,
      footer,
      showCloseButton,
      closeOnBackdrop = true,
      enablePanDownToClose = true,
      scrollable = true,
      contentMode,
      style,
      contentContainerStyle,
      enableDynamicSizing = false,
      modalProps,
    },
    ref,
  ) {
    const colors = useThemeColors();
    const sheetRef = useRef<BottomSheetModal>(null);
    useImperativeHandle(ref, () => sheetRef.current!, []);

    const snapPoints = useMemo(
      () => snapPointsProp ?? ['50%', '90%'],
      [snapPointsProp],
    );

    const resolvedMode: 'scroll' | 'view' | 'raw' =
      contentMode ?? (scrollable ? 'scroll' : 'view');

    const showClose = showCloseButton ?? Boolean(title);

    useEffect(() => {
      const modal = sheetRef.current;
      if (!modal) return;
      if (open) {
        triggerHapticFeedback('light');
        // Defer present so the modal portal is ready after layout.
        const id = requestAnimationFrame(() => {
          modal.present();
        });
        return () => cancelAnimationFrame(id);
      }
      modal.dismiss();
    }, [open]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.45}
          pressBehavior={closeOnBackdrop ? 'close' : 'none'}
        />
      ),
      [closeOnBackdrop],
    );

    const header =
      title || showClose ? (
        <View style={styles.header}>
          <Text variant="spline-bold-h5" style={{ flex: 1, color: colors.fg }}>
            {title ?? ''}
          </Text>
          {showClose ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              onPress={() => {
                triggerHapticFeedback('light');
                sheetRef.current?.dismiss();
              }}
            >
              <CloseCircle size={22} color={colors.muted} variant="Linear" />
            </Pressable>
          ) : null}
        </View>
      ) : null;

    const body = (
      <>
        {header}
        {children}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </>
    );

    /** FlatList/ScrollView scrollables must be direct modal children — no Fragment wrapper. */
    const rawContent =
      !header && !footer ? (
        children
      ) : (
        <>
          {header}
          {children}
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </>
      );

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        index={index}
        enableDynamicSizing={enableDynamicSizing}
        enablePanDownToClose={enablePanDownToClose}
        onDismiss={onClose}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: colors.border, width: 40 }}
        backgroundStyle={{
          backgroundColor: colors.bg,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        style={style}
        {...modalProps}
      >
        {resolvedMode === 'raw' ? (
          rawContent
        ) : resolvedMode === 'scroll' ? (
          <BottomSheetScrollView
            contentContainerStyle={[styles.content, contentContainerStyle]}
          >
            {body}
          </BottomSheetScrollView>
        ) : (
          <BottomSheetView style={[styles.content, contentContainerStyle]}>
            {body}
          </BottomSheetView>
        )}
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  footer: {
    marginTop: 16,
  },
});
