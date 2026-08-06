import { BottomSheet } from './BottomSheet';
import { SuccessPanel, type SuccessPanelProps } from './SuccessPanel';

export type SuccessBottomSheetProps = SuccessPanelProps & {
  open: boolean;
  onClose?: () => void;
  /** Default: `['42%']` — short success sheet. */
  snapPoints?: (string | number)[];
  closeOnBackdrop?: boolean;
  enablePanDownToClose?: boolean;
};

/**
 * Success confirmation as a bottom sheet (mobile-first).
 * Use declaratively, or prefer `useSuccessBottomSheet()` for programmatic opens.
 */
export function SuccessBottomSheet({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  buttonLabel,
  onButtonClick,
  style,
  snapPoints = ['42%'],
  closeOnBackdrop = true,
  enablePanDownToClose = true,
}: SuccessBottomSheetProps) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      snapPoints={snapPoints}
      showCloseButton={false}
      closeOnBackdrop={closeOnBackdrop}
      enablePanDownToClose={enablePanDownToClose}
      scrollable={false}
    >
      <SuccessPanel
        title={title}
        description={description}
        icon={icon}
        buttonLabel={buttonLabel}
        onButtonClick={() => {
          onButtonClick?.();
          onClose?.();
        }}
        style={style}
      >
        {children}
      </SuccessPanel>
    </BottomSheet>
  );
}
