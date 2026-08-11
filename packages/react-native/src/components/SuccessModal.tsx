import { Modal } from './Modal';
import { SuccessPanel, type SuccessPanelProps } from './SuccessPanel';

export type SuccessModalProps = SuccessPanelProps & {
  open: boolean;
  onClose?: () => void;
};

/**
 * Centered success dialog (RN Modal).
 */
export function SuccessModal({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  buttonLabel,
  onButtonClick,
  style,
}: SuccessModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
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
    </Modal>
  );
}
