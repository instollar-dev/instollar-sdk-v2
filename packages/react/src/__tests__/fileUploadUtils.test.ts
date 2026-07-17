import { describe, expect, it } from 'vitest';
import {
  acceptsAllFileTypes,
  formatAcceptDisplay,
  formatFileSize,
  normalizeValue,
  validateFileAgainstAccept,
} from '../components/fileUploadUtils';

describe('fileUploadUtils', () => {
  it('normalizes string and asset values', () => {
    expect(normalizeValue('https://cdn.example.com/docs/report.pdf')).toEqual([
      { url: 'https://cdn.example.com/docs/report.pdf', label: 'report.pdf' },
    ]);
    expect(
      normalizeValue({
        fileUrl: 'https://x.com/a.png',
        publicId: '1',
        result: 'uploaded',
      }),
    ).toEqual([{ url: 'https://x.com/a.png', label: 'a.png' }]);
  });

  it('formats accept display and validates extensions', () => {
    expect(formatAcceptDisplay('.pdf,.jpg')).toContain('PDF');
    expect(acceptsAllFileTypes('*/*')).toBe(true);
    const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' });
    expect(validateFileAgainstAccept(file, '.pdf', 5)).toBeNull();
    expect(validateFileAgainstAccept(file, '.png', 5)).toBe('invalidType');
  });

  it('formats file size', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
  });
});
