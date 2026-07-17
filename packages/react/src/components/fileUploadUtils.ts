import type { UploadedFileAsset } from './FileUpload.types';

export const ALL_DOCUMENT_UPLOAD_ACCEPT = '*/*';

export function acceptsAllFileTypes(accept: string): boolean {
  const trimmed = accept.trim();
  if (!trimmed) return true;
  return trimmed.split(',').some((part) => {
    const token = part.trim();
    return token === '*/*' || token === '*';
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

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

export function validateFileAgainstAccept(
  file: File,
  accept: string,
  maxSizeMB: number,
): 'invalidType' | 'fileTooLarge' | null {
  if (!acceptsAllFileTypes(accept)) {
    const acceptedExtensions = accept.split(',').map((ext) => ext.trim());
    const isAccepted = acceptedExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext.toLowerCase()),
    );
    if (!isAccepted) return 'invalidType';
  }
  if (file.size > maxSizeMB * 1024 * 1024) return 'fileTooLarge';
  return null;
}

export function isNetworkDisconnectError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const errorLike = error as { message?: unknown; request?: unknown; response?: unknown };
  if (Boolean(errorLike.request) && !errorLike.response) return true;
  if (typeof errorLike.message !== 'string') return false;
  const message = errorLike.message.toLowerCase();
  return message.includes('no response from server') || message.includes('network error');
}

export function getFileExtension(name: string): string {
  const ext = name.split('.').pop();
  return ext ? ext.toLowerCase() : '';
}

export function isImageAsset(nameOrUrl: string): boolean {
  if (nameOrUrl.startsWith('offline-blob:')) return true;
  const ext = getFileExtension(nameOrUrl);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif'].includes(ext);
}

export function isVideoAsset(nameOrUrl: string): boolean {
  const ext = getFileExtension(nameOrUrl);
  return ['mp4', 'webm', 'ogg', 'mov', 'm4v'].includes(ext);
}

export function offlineBlobIdFromUrl(url: string): string | null {
  if (!url.startsWith('offline-blob:')) return null;
  return url.replace('offline-blob:', '');
}
