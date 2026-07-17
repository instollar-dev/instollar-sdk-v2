import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { FileUpload } from '../components/FileUpload';

beforeAll(() => {
  URL.createObjectURL = vi.fn(() => 'blob:mock');
  URL.revokeObjectURL = vi.fn();
});

describe('FileUpload', () => {
  it('renders empty drop zone and calls onFileSelect when autoUpload is false', () => {
    const onFileSelect = vi.fn();
    render(
      <FileUpload
        onFileSelect={onFileSelect}
        autoUpload={false}
        strings={{ browse: 'Pick file' }}
      />,
    );

    expect(screen.getByText(/click to upload/i)).toBeInTheDocument();
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['hello'], 'hello.pdf', { type: 'application/pdf' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('shows external error', () => {
    render(
      <FileUpload onFileSelect={() => undefined} error="Required attachment" />,
    );
    expect(screen.getByText('Required attachment')).toBeInTheDocument();
  });
});
