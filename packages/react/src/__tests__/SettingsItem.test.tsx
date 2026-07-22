import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SettingsItem } from '../components/SettingsItem';
import { useSettingsAccordion } from '../hooks/useSettingsAccordion';

describe('SettingsItem', () => {
  it('renders header and chevron; expands body when open', () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <SettingsItem
        icon={<span data-testid="icon">i</span>}
        title="Account & Security"
        description="Password and 2FA"
        isOpen={false}
        onClick={onClick}
      >
        <p>Secret body</p>
      </SettingsItem>,
    );

    expect(screen.getByText('Account & Security')).toBeInTheDocument();
    expect(screen.getByText('Password and 2FA')).toBeInTheDocument();
    expect(screen.queryByText('Secret body')).not.toBeInTheDocument();

    const header = screen.getByRole('button', { name: /Account & Security/i });
    expect(header).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(header);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <SettingsItem
        icon={<span>i</span>}
        title="Account & Security"
        description="Password and 2FA"
        isOpen
        onClick={onClick}
      >
        <p>Secret body</p>
      </SettingsItem>,
    );

    expect(screen.getByText('Secret body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Account & Security/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });
});

describe('useSettingsAccordion', () => {
  it('toggles single-open section state', () => {
    function Demo() {
      const { openSection, toggleSection, isSectionOpen } = useSettingsAccordion();
      return (
        <div>
          <span data-testid="open">{openSection ?? 'null'}</span>
          <span data-testid="is-a">{String(isSectionOpen('A'))}</span>
          <button type="button" onClick={() => toggleSection('A')}>
            toggle A
          </button>
          <button type="button" onClick={() => toggleSection('B')}>
            toggle B
          </button>
        </div>
      );
    }

    render(<Demo />);
    expect(screen.getByTestId('open')).toHaveTextContent('null');

    fireEvent.click(screen.getByRole('button', { name: 'toggle A' }));
    expect(screen.getByTestId('open')).toHaveTextContent('A');
    expect(screen.getByTestId('is-a')).toHaveTextContent('true');

    fireEvent.click(screen.getByRole('button', { name: 'toggle B' }));
    expect(screen.getByTestId('open')).toHaveTextContent('B');
    expect(screen.getByTestId('is-a')).toHaveTextContent('false');

    fireEvent.click(screen.getByRole('button', { name: 'toggle B' }));
    expect(screen.getByTestId('open')).toHaveTextContent('null');
  });
});
