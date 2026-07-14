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

  it('applies secondary variant inline colors', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole('button', { name: 'Secondary' });
    expect(button.style.backgroundColor).toBe('var(--color-secondary, #effe3e)');
    expect(button.style.color).toBe('var(--color-primary, #012b15)');
  });

  it('applies ghost destructive tone color', () => {
    render(
      <Button variant="ghost" tone="destructive">
        Delete
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Delete' }).style.color).toBe(
      'var(--color-destructive, #b42318)',
    );
  });

  it('aliases danger to destructive solid styling', () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByRole('button', { name: 'Danger' });
    expect(button.style.backgroundColor).toBe('var(--color-destructive, #b42318)');
    expect(button.style.color).toBe('rgb(255, 255, 255)');
  });
});
