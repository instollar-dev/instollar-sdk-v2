import { useCallback, type ReactNode } from 'react';
import { SuccessModal, type SuccessModalProps } from '../components/SuccessModal';
import {
  useModal,
  type ModalConfig,
  type ModalContextValue,
} from '../components/ModalProvider';

export type OpenSuccessModalOptions = Omit<SuccessModalProps, 'onButtonClick' | 'children'> & {
  /** Called when the primary button is clicked (modal closes afterward). */
  onButtonClick?: () => void;
  children?: ReactNode;
  size?: ModalConfig['size'];
  className?: string;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  onClose?: () => void;
  id?: string;
};

export interface SuccessModalApi extends ModalContextValue {
  openSuccessModal: (options?: OpenSuccessModalOptions) => string;
}

/**
 * Convenience wrapper around `useModal` for the shared success dialog.
 *
 * @example
 * ```tsx
 * const { openSuccessModal } = useSuccessModal();
 * openSuccessModal({
 *   title: 'Order Created Successfully!',
 *   description: 'You have successfully created an order from this lead interest.',
 *   buttonLabel: 'View Order Details',
 *   onButtonClick: () => navigate(`/orders/${id}`),
 * });
 * ```
 */
export function useSuccessModal(): SuccessModalApi {
  const modal = useModal();

  const openSuccessModal = useCallback(
    (options: OpenSuccessModalOptions = {}): string => {
      const {
        title,
        description,
        icon,
        children,
        buttonLabel,
        onButtonClick,
        size = 'md',
        className,
        showCloseButton = false,
        closeOnBackdrop = true,
        closeOnEscape = true,
        onClose,
        id,
      } = options;

      return modal.openModal({
        id,
        size,
        className,
        showCloseButton,
        closeOnBackdrop,
        closeOnEscape,
        onClose,
        content: (
          <SuccessModal
            title={title}
            description={description}
            icon={icon}
            buttonLabel={buttonLabel}
            onButtonClick={() => {
              onButtonClick?.();
              modal.closeModal();
            }}
          >
            {children}
          </SuccessModal>
        ),
      });
    },
    [modal],
  );

  return {
    ...modal,
    openSuccessModal,
  };
}
