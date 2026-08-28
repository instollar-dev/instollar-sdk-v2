import { ConfirmPanel, type ConfirmPanelProps } from './ConfirmPanel';
import { Sheet } from './Sheet';

export type ConfirmSheetProps = ConfirmPanelProps & {
  open: boolean;
  onClose?: () => void;
  /** Allow backdrop / Android back to cancel. Default: false when variant is danger. */
  dismissible?: boolean;
  /** Extra bottom padding (e.g. host safe-area inset). */
  bottomInset?: number;
};

export function ConfirmSheet({
  open,
  onClose,
  dismissible,
  variant = 'default',
  loading,
  onCancel,
  onConfirm,
  bottomInset = 0,
  ...panelProps
}: ConfirmSheetProps) {
  const allowDismiss =
    dismissible ?? (variant !== 'danger' && variant !== 'warning');

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <Sheet
      open={open}
      onClose={allowDismiss ? handleCancel : undefined}
      closeOnBackdrop={allowDismiss}
      bottomInset={bottomInset || undefined}
      contentContainerStyle={{ paddingBottom: 0 }}>
      <ConfirmPanel
        {...panelProps}
        variant={variant}
        loading={loading}
        // Sheet already clears the soft nav; keep a small design pad only.
        bottomInset={0}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </Sheet>
  );
}
