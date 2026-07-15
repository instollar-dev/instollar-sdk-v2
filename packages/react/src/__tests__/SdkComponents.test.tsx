import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef, useEffect } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { ModalProvider, useModal } from '../components/ModalProvider';
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
