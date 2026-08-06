import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from '../components/ProgressBar';

describe('ProgressBar', () => {
  it('renders with progressbar role and clamped value', () => {
    render(<ProgressBar value={150} max={100} label="Upload" aria-label="Upload progress" />);
    const bar = screen.getByRole('progressbar', { name: 'Upload progress' });
    expect(bar).toHaveAttribute('aria-valuenow', '100');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  it('shows percentage when showValue is set', () => {
    render(<ProgressBar value={42} showValue label="Loading" />);
    expect(screen.getByText('42%')).toBeInTheDocument();
  });

  it('renders a bare track with no label chrome', () => {
    render(<ProgressBar value={30} aria-label="Wizard progress" />);
    expect(screen.getByRole('progressbar', { name: 'Wizard progress' })).toBeInTheDocument();
    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });
});
