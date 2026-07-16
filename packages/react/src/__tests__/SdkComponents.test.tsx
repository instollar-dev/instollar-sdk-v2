import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useEffect } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AlertText, dismissibleAlertProps } from '../components/AlertText';
import { DateInput, TimeInput } from '../components/DateInput';
import { DrawerProvider, useDrawer } from '../components/DrawerProvider';
import { DropdownMenu } from '../components/DropdownMenu';
import { ModalProvider, useModal } from '../components/ModalProvider';
import { OtpInput, VerificationInput } from '../components/OtpInput';
import { createStatusResolver } from '../components/StatusBadge';
import { Table, type TableHandle } from '../components/Table';
import { Tabs } from '../components/Tabs';
import { toSelectOptions } from '../utils/toSelectOptions';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe('component foundations', () => {
  it('normalizes primitive and object select options to string values', () => {
    expect(
      toSelectOptions([
        1,
        'two',
        { label: 'Three', value: 3, description: 'Third option' },
      ]),
    ).toEqual([
      { label: '1', value: '1' },
      { label: 'two', value: 'two' },
      { label: 'Three', value: '3', description: 'Third option' },
    ]);
  });
});

describe('AlertText', () => {
  it('renders nothing for empty content', () => {
    const { container, rerender } = render(<AlertText>{''}</AlertText>);
    expect(container).toBeEmptyDOMElement();
    rerender(<AlertText>{null}</AlertText>);
    expect(container).toBeEmptyDOMElement();
  });

  it('dismisses, calls onDismiss, and reappears for a new message', () => {
    const onDismiss = vi.fn();
    const { rerender } = render(
      <AlertText dismissible onDismiss={onDismiss}>
        First error
      </AlertText>,
    );
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledOnce();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    rerender(
      <AlertText dismissible onDismiss={onDismiss}>
        New error
      </AlertText>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('New error');
  });

  it('builds dismissible props only when a message exists', () => {
    const clear = vi.fn();
    expect(dismissibleAlertProps('', clear)).toEqual({
      children: '',
      dismissible: false,
    });
    expect(dismissibleAlertProps('Failed', clear)).toEqual({
      children: 'Failed',
      dismissible: true,
      onDismiss: clear,
    });
  });
});

describe('StatusBadge resolver', () => {
  const resolved = createStatusResolver({
    rules: [
      {
        matches: ['pending_qa'],
        variant: 'warning',
        icon: 'clock',
        label: 'Pending QA',
      },
    ],
  });

  it('normalizes status aliases and supports presentation overrides', () => {
    expect(resolved.resolve('Pending-QA')).toEqual({
      variant: 'warning',
      label: 'Pending QA',
      icon: 'clock',
    });

    render(<resolved.StatusBadge status="pending qa" label="Review" icon={false} />);
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(document.querySelector('svg')).not.toBeInTheDocument();
  });
});

describe('Table', () => {
  it('supports the imperative uncontrolled data and validation contract', () => {
    const ref = createRef<TableHandle>();
    render(
      <Table
        ref={ref}
        mobileResponsive={false}
        columns={[
          {
            key: 'quantity',
            label: 'Quantity',
            type: 'number',
            validate: (value) => (value > 0 ? null : 'Required'),
          },
        ]}
      />,
    );

    expect(ref.current?.getDataWithoutIds()).toEqual([{ quantity: 0 }]);
    let validation: ReturnType<TableHandle['validate']> | undefined;
    act(() => {
      validation = ref.current?.validate();
    });
    expect(validation).toEqual({
      isValid: false,
      errors: [{ rowIndex: 0, field: 'quantity', message: 'Required' }],
    });

    act(() => ref.current?.updateRow(0, { quantity: 2 }));
    act(() => {
      validation = ref.current?.validate();
    });
    expect(validation).toEqual({ isValid: true, errors: [] });

    act(() => ref.current?.addRow());
    expect(ref.current?.getRowCount()).toBe(2);
  });

  it('emits controlled row changes and stores a cleared number as zero', () => {
    const onRowsChange = vi.fn();
    render(
      <Table
        rows={[{ id: 1, quantity: 2 }]}
        onRowsChange={onRowsChange}
        mobileResponsive={false}
        columns={[{ key: 'quantity', label: 'Quantity', type: 'number' }]}
      />,
    );

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '' } });
    expect(onRowsChange).toHaveBeenCalledWith([{ id: 1, quantity: 0 }]);
  });
});

describe('Tabs', () => {
  it('supports controlled string tabs without rendering content', () => {
    const onTabChange = vi.fn();
    render(
      <Tabs tabs={['Profile', 'Team']} activeTab="Profile" onTabChange={onTabChange} />,
    );

    fireEvent.click(screen.getByRole('tab', { name: 'Team' }));
    expect(onTabChange).toHaveBeenCalledWith('Team');
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
  });
});

describe('ModalProvider', () => {
  function OpenModal() {
    const { openModal } = useModal();
    useEffect(() => {
      openModal({ content: <p>Programmatic content</p> });
    }, [openModal]);
    return null;
  }

  it('opens programmatic content and closes the top modal', () => {
    render(
      <ModalProvider>
        <OpenModal />
      </ModalProvider>,
    );

    expect(screen.getByRole('dialog')).toHaveTextContent('Programmatic content');
    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('DrawerProvider', () => {
  function OpenDrawer() {
    const { openDrawer } = useDrawer();
    useEffect(() => {
      openDrawer({ title: 'Edit profile', content: <p>Drawer content</p> });
    }, [openDrawer]);
    return null;
  }

  it('opens programmatic content and unmounts after the exit animation', () => {
    vi.useFakeTimers();
    try {
      render(
        <DrawerProvider>
          <OpenDrawer />
        </DrawerProvider>,
      );

      const drawer = screen.getByRole('dialog');
      expect(drawer).toHaveTextContent('Edit profile');
      expect(drawer).toHaveTextContent('Drawer content');

      fireEvent.click(screen.getByRole('button', { name: 'Close drawer' }));
      // Still mounted while the slide-out animation plays.
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('DropdownMenu', () => {
  it('opens the menu and fires item onClick', () => {
    const onClick = vi.fn();
    render(
      <DropdownMenu
        items={[
          { label: 'Edit', onClick },
          { label: 'Delete', onClick: vi.fn(), disabled: true },
        ]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { expanded: false }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

describe('DateInput', () => {
  it('coerces Date values and exposes TimeInput as type=time', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <DateInput label="Interview" value={new Date(2025, 7, 22)} onChange={onChange} />,
    );
    expect(screen.getByLabelText('Interview')).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText('Interview')).toHaveValue('2025-08-22');

    rerender(<TimeInput label="Start" defaultValue="14:30" />);
    expect(screen.getByLabelText('Start')).toHaveAttribute('type', 'time');
  });
});

describe('OtpInput', () => {
  it('accepts digits, masks, and aliases VerificationInput', () => {
    vi.useFakeTimers();
    try {
      const onChange = vi.fn();
      expect(VerificationInput).toBe(OtpInput);

      render(<OtpInput onChange={onChange} showResend={false} />);
      const first = screen.getByLabelText('Digit 1 of 6');
      fireEvent.change(first, { target: { value: '1' } });
      expect(onChange).toHaveBeenCalledWith('1');
      expect(first).toHaveValue('1');

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(first).toHaveValue('*');
    } finally {
      vi.useRealTimers();
    }
  });
});
