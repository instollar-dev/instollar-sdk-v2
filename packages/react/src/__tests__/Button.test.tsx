import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from '../components/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Continue</Button>);
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
  });

  it('sets aria-busy and disables when loading', () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('applies secondary variant class', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button', { name: 'Secondary' }).className).toContain('bg-secondary');
  });
});
