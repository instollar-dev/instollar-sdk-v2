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
    expect(button.style.backgroundColor).toBe('var(--color-secondary, #a8d9bc)');
    expect(button.style.color).toBe('var(--color-brand, #012b15)');
  });

  it('applies primary variant brand fill', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button', { name: 'Primary' }).style.backgroundColor).toBe(
      'var(--color-brand, #012b15)',
    );
  });

  it('applies ghost destructive tone color', () => {
    render(
      <Button variant="ghost" tone="destructive">
        Delete
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Delete' }).style.color).toBe(
      'var(--color-destructive, #f49e0c)',
    );
  });

  it('applies ghost danger tone color', () => {
    render(
      <Button variant="ghost" tone="danger">
        Ban
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Ban' }).style.color).toBe(
      'var(--color-danger, #dc2626)',
    );
  });

  it('applies underline variant text styles', () => {
    render(<Button variant="underline">Learn more</Button>);
    const button = screen.getByRole('button', { name: 'Learn more' });
    expect(button.style.color).toBe(
      'var(--color-soft-button, var(--color-fg, var(--color-brand, #012b15)))',
    );
    expect(button.className).toContain('underline');
  });

  it('applies underline destructive tone', () => {
    render(
      <Button variant="underline" tone="destructive">
        Remove
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Remove' }).style.color).toBe(
      'var(--color-destructive, #f49e0c)',
    );
  });

  it('applies danger solid fill', () => {
    render(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button', { name: 'Danger' }).style.backgroundColor).toBe(
      'var(--color-danger, #dc2626)',
    );
  });

  it('applies destructive solid fill', () => {
    render(<Button variant="destructive">Destructive</Button>);
    const button = screen.getByRole('button', { name: 'Destructive' });
    expect(button.style.backgroundColor).toBe('var(--color-destructive, #f49e0c)');
    expect(button.style.color).toBe('rgb(255, 255, 255)');
  });
});
