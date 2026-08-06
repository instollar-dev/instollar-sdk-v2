import { useCallback, type ReactNode } from 'react';
import {
  useBottomSheet,
  type BottomSheetConfig,
  type BottomSheetContextValue,
} from '../components/BottomSheetProvider';
import {
  SuccessPanel,
  type SuccessPanelProps,
} from '../components/SuccessPanel';

export type OpenSuccessBottomSheetOptions = Omit<
  SuccessPanelProps,
  'onButtonClick' | 'children'
> & {
  onButtonClick?: () => void;
  children?: ReactNode;
  id?: string;
  snapPoints?: BottomSheetConfig['snapPoints'];
  index?: BottomSheetConfig['index'];
  closeOnBackdrop?: boolean;
  enablePanDownToClose?: boolean;
  scrollable?: boolean;
  onClose?: () => void;
};

export type SuccessBottomSheetApi = BottomSheetContextValue & {
  openSuccessBottomSheet: (options?: OpenSuccessBottomSheetOptions) => string;
};

/**
 * Programmatic success sheet — mirrors web `useSuccessModal`.
 *
 * @example
 * ```tsx
 * const { openSuccessBottomSheet } = useSuccessBottomSheet();
 * openSuccessBottomSheet({
 *   title: 'Order Created Successfully!',
 *   description: 'You have successfully created an order.',
 *   buttonLabel: 'View Order',
 *   onButtonClick: () => router.push(`/orders/${id}`),
 * });
 * ```
 */
export function useSuccessBottomSheet(): SuccessBottomSheetApi {
  const sheet = useBottomSheet();

  const openSuccessBottomSheet = useCallback(
    (options: OpenSuccessBottomSheetOptions = {}): string => {
      const {
        title,
        description,
        icon,
        children,
        buttonLabel,
        onButtonClick,
        id,
        snapPoints = ['42%'],
        index,
        closeOnBackdrop = true,
        enablePanDownToClose = true,
        scrollable = false,
        onClose,
      } = options;

      return sheet.openBottomSheet({
        id,
        snapPoints,
        index,
        showCloseButton: false,
        closeOnBackdrop,
        enablePanDownToClose,
        scrollable,
        onClose,
        content: (
          <SuccessPanel
            title={title}
            description={description}
            icon={icon}
            buttonLabel={buttonLabel}
            onButtonClick={() => {
              onButtonClick?.();
              sheet.closeBottomSheet();
            }}
          >
            {children}
          </SuccessPanel>
        ),
      });
    },
    [sheet],
  );

  return {
    ...sheet,
    openSuccessBottomSheet,
  };
}
