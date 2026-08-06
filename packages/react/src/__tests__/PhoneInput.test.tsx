import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PhoneInput } from '../components/PhoneInput';

describe('PhoneInput', () => {
  it('renders label and default Nigeria dial code', () => {
    render(<PhoneInput label="Phone" />);
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('+234')).toBeInTheDocument();
  });

  it('emits digit-only national number and E.164 on change', () => {
    const onChange = vi.fn();
    const onE164Change = vi.fn();
    render(
      <PhoneInput
        label="Phone"
        defaultCountryCode="NG"
        onChange={onChange}
        onE164Change={onE164Change}
      />,
    );

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: '801 234 5678' },
    });

    expect(onChange).toHaveBeenCalledWith({
      countryCode: 'NG',
      nationalNumber: '8012345678',
    });
    expect(onE164Change).toHaveBeenCalledWith('+2348012345678');
  });

  it('shows validation error text', () => {
    render(<PhoneInput label="Phone" error="Invalid phone" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid phone');
  });
});
