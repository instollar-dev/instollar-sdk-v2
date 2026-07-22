import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Avatar, getAvatarInitials } from '../components/Avatar';

describe('getAvatarInitials', () => {
  it('takes first letters of two words', () => {
    expect(getAvatarInitials('Sarah Adams')).toBe('SA');
  });

  it('uppercases a short initials string', () => {
    expect(getAvatarInitials('sa')).toBe('SA');
  });

  it('falls back to ? for empty input', () => {
    expect(getAvatarInitials('   ')).toBe('?');
  });
});

describe('Avatar', () => {
  it('renders an image when src is provided', () => {
    render(<Avatar src="https://example.com/a.png" initials="SA" alt="Sarah Adams" />);
    const image = screen.getByRole('img', { name: 'Sarah Adams' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/a.png');
  });

  it('renders initials when src is null', () => {
    render(<Avatar src={null} initials="Sarah Adams" />);
    expect(screen.getByRole('img', { name: 'Sarah Adams' })).toHaveTextContent('SA');
    expect(screen.queryByRole('img', { name: 'Sarah Adams' })?.tagName).toBe('DIV');
  });

  it('falls back to initials when the image errors', () => {
    render(<Avatar src="https://example.com/broken.png" initials="JD" />);
    const image = screen.getByRole('img', { name: 'JD' });
    expect(image.tagName).toBe('IMG');
    fireEvent.error(image);
    const fallback = screen.getByRole('img', { name: 'JD' });
    expect(fallback.tagName).toBe('DIV');
    expect(fallback).toHaveTextContent('JD');
  });

  it('renders as a button when onClick is provided', () => {
    const onClick = vi.fn();
    render(<Avatar src={null} initials="SA" onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'SA' });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
