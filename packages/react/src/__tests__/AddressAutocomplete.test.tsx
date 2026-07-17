import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AddressAutocomplete } from '../components/AddressAutocomplete';

describe('AddressAutocomplete', () => {
  it('renders controlled value and calls onInputChange', () => {
    const onInputChange = vi.fn();
    render(
      <AddressAutocomplete
        label="Address"
        inputValue="Lagos"
        onInputChange={onInputChange}
        onPlaceSelect={() => undefined}
        apiKey="test-key"
      />,
    );

    const input = screen.getByLabelText('Address');
    expect(input).toHaveValue('Lagos');
    fireEvent.change(input, { target: { value: 'Abuja' } });
    expect(onInputChange).toHaveBeenCalledWith('Abuja');
  });

  it('shows form error over API errors', () => {
    render(
      <AddressAutocomplete
        label="Address"
        inputValue=""
        onInputChange={() => undefined}
        onPlaceSelect={() => undefined}
        error="Required"
      />,
    );

    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByLabelText('Address')).toHaveAttribute('aria-invalid', 'true');
  });
});
