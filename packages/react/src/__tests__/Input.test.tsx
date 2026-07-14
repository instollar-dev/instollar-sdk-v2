import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from '../components/Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" placeholder="you@example.com" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Input label="Email" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('disables the input', () => {
    render(<Input label="Email" disabled />);
    expect(screen.getByLabelText('Email')).toBeDisabled();
  });
});
