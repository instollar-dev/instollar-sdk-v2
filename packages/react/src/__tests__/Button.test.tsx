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
    expect(screen.getByRole('button', { name: 'Secondary' }).className).toContain(
      'bg-[var(--color-secondary,#effe3e)]',
    );
  });

  it('applies ghost destructive tone', () => {
    render(
      <Button variant="ghost" tone="destructive">
        Delete
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Delete' }).className).toContain(
      'text-[var(--color-destructive,#b42318)]',
    );
  });

  it('aliases danger to destructive solid styling', () => {
    render(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button', { name: 'Danger' }).className).toContain(
      'bg-[var(--color-destructive,#b42318)]',
    );
  });
});
