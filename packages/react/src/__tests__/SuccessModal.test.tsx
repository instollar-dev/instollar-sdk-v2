import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModalProvider } from '../components/ModalProvider';
import { SuccessModal } from '../components/SuccessModal';
import { useSuccessModal } from '../hooks/useSuccessModal';

describe('SuccessModal', () => {
  it('renders defaults', () => {
    render(<SuccessModal onButtonClick={() => undefined} />);
    expect(screen.getByRole('heading', { name: 'Success!' })).toBeInTheDocument();
    expect(screen.getByText('Your action completed successfully.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Okay, thanks!' })).toBeInTheDocument();
  });

  it('uses custom copy and fires the button', () => {
    const onButtonClick = vi.fn();
    render(
      <SuccessModal
        title="Order Created Successfully!"
        description="You have successfully created an order from this lead interest."
        buttonLabel="View Order Details"
        onButtonClick={onButtonClick}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'View Order Details' }));
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });
});

describe('useSuccessModal', () => {
  it('opens a success dialog through the modal stack', () => {
    function Demo() {
      const { openSuccessModal } = useSuccessModal();
      return (
        <button
          type="button"
          onClick={() =>
            openSuccessModal({
              title: 'Order Created Successfully!',
              description: 'Created from this lead.',
              buttonLabel: 'View Order Details',
            })
          }
        >
          Open success
        </button>
      );
    }

    render(
      <ModalProvider>
        <Demo />
      </ModalProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open success' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Order Created Successfully!' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'View Order Details' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
