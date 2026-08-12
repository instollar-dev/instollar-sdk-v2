import type { UploadedFileAsset } from './FileUpload.types';
import type { PickedFile } from '../utils/filePickerModules';

export const ALL_DOCUMENT_UPLOAD_ACCEPT = '*/*';

const EXT_TO_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  heic: 'image/heic',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export function acceptsAllFileTypes(accept: string): boolean {
  const trimmed = accept.trim();
  if (!trimmed) return true;
  return trimmed.split(',').some((part) => {
    const token = part.trim();
    return token === '*/*' || token === '*';
  });
}

export function acceptAllowsImages(accept: string): boolean {
  if (acceptsAllFileTypes(accept)) return true;
  return accept.split(',').some((part) => {
    const token = part.trim().toLowerCase();
    return (
      token === 'image/*' ||
      token.startsWith('image/') ||
      ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic'].includes(token) ||
      ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'].includes(token.replace(/^\./, ''))
    );
  });
}

export function formatAcceptDisplay(accept: string): string {
  if (acceptsAllFileTypes(accept)) return 'All file types';

  const tokens = accept
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (tokens.length === 0) return 'DOC, PDF';

  const labels = tokens.map((token) => {
    if (token.endsWith('/*')) {
      return token.replace('/*', '').toUpperCase();
    }
    if (token.startsWith('.')) {
      return token.slice(1).toUpperCase();
    }
    const subtype = token.split('/')[1];
    return (subtype || token).toUpperCase();
  });

  return Array.from(new Set(labels)).join(', ');
}

export function acceptToDocumentPickerTypes(accept: string): string | string[] {
  if (acceptsAllFileTypes(accept)) return '*/*';

  const types = accept
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((token) => {
      if (token.includes('/')) return token;
      if (token.startsWith('.')) {
        return EXT_TO_MIME[token.slice(1).toLowerCase()] ?? token;
      }
      return EXT_TO_MIME[token.toLowerCase()] ?? token;
    });

  return types.length === 1 ? types[0]! : types;
}

export function normalizeValue(
  value:
    | string
    | string[]
    | UploadedFileAsset
    | UploadedFileAsset[]
    | null
    | undefined,
): { url: string; label: string }[] {
  if (value == null || value === '') return [];
  if (typeof value === 'string') {
    const label = value.split('/').filter(Boolean).pop() ?? 'Uploaded file';
    return [{ url: value, label }];
  }
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    return (value as string[]).map((v) => {
      const label = v.split('/').filter(Boolean).pop() ?? 'Uploaded file';
      return { url: v, label };
    });
  }
  const assets = Array.isArray(value)
    ? (value as UploadedFileAsset[])
    : value
      ? [value as UploadedFileAsset]
      : [];
  return assets
    .filter((asset) => asset?.fileUrl)
    .map((asset) => {
      const label =
        asset.fileUrl.split('/').filter(Boolean).pop() ?? 'Uploaded file';
      return { url: asset.fileUrl, label };
    });
}

export function formatFileSize(bytes: number | undefined): string {
  if (bytes == null || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

export function getFileExtension(name: string): string {
  const ext = name.split('.').pop();
  return ext ? ext.toLowerCase() : '';
}

function fileMatchesAccept(file: PickedFile, accept: string): boolean {
  if (acceptsAllFileTypes(accept)) return true;

  const name = file.name.toLowerCase();
  const mime = file.mimeType?.toLowerCase() ?? '';

  return accept.split(',').some((part) => {
    const token = part.trim().toLowerCase();
    if (!token) return false;
    if (token.endsWith('/*')) {
      const prefix = token.slice(0, -1);
      return mime.startsWith(prefix);
    }
    if (token.startsWith('.')) {
      return name.endsWith(token);
    }
    if (token.includes('/')) {
      return mime === token;
    }
    return name.endsWith(`.${token}`);
  });
}

export function validatePickedFileAgainstAccept(
  file: PickedFile,
  accept: string,
  maxSizeMB: number,
): 'invalidType' | 'fileTooLarge' | null {
  if (!fileMatchesAccept(file, accept)) return 'invalidType';
  if (file.size != null && file.size > maxSizeMB * 1024 * 1024) return 'fileTooLarge';
  return null;
}

export function isImageAsset(nameOrUrl: string): boolean {
  const ext = getFileExtension(nameOrUrl);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'bmp', 'avif'].includes(ext);
}

export function isNetworkDisconnectError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const errorLike = error as { message?: unknown; request?: unknown; response?: unknown };
  if (Boolean(errorLike.request) && !errorLike.response) return true;
  if (typeof errorLike.message !== 'string') return false;
  const message = errorLike.message.toLowerCase();
  return message.includes('no response from server') || message.includes('network error');
}
