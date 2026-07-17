import type { ReactNode } from 'react';

export interface UploadedFileAsset {
  fileUrl: string;
  publicId: string;
  result: string;
}

export interface FileUploadStrings {
  clickToUpload: string;
  browse: string;
  browseUploading: string;
  uploaded: string;
  clear: string;
  clearAll: string;
  all: string;
  files: string;
  remove: string;
  addMore: string;
  preview: string;
  retry: string;
  invalidType: string;
  fileTooLarge: string;
  uploadFailed: string;
}

export const DEFAULT_FILE_UPLOAD_STRINGS: FileUploadStrings = {
  clickToUpload: 'Click to upload or drag and drop a file',
  browse: 'Browse file',
  browseUploading: 'Uploading...',
  uploaded: 'Uploaded',
  clear: 'Clear',
  clearAll: 'All',
  all: 'All',
  files: 'Files',
  remove: 'Remove',
  addMore: 'Add More',
  preview: 'Preview',
  retry: 'Retry',
  invalidType: 'Invalid file type',
  fileTooLarge: 'File is too large',
  uploadFailed: 'Failed to upload file. Please try again.',
};

export interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  label?: string;
  helperText?: string;
  error?: string;
  autoUpload?: boolean;
  multiple?: boolean;
  onUploadStart?: () => void;
  onUploadComplete?: (assets: UploadedFileAsset[], file: File) => void;
  onUploadError?: (error: unknown) => void;
  value?: string | string[] | UploadedFileAsset | UploadedFileAsset[] | null;
  onDeleteFile?: () => void;
  onDeleteFileAtIndex?: (index: number, source: 'prefilled' | 'selected') => void;
  showAssetPreviewGrid?: boolean;
  applyWatermark?: boolean;
  allowOfflineSave?: boolean;
  uploadFn?: (
    formData: FormData,
    options: { applyWatermark?: boolean },
  ) => Promise<UploadedFileAsset[]>;
  offlineSaveFn?: (files: File[]) => Promise<UploadedFileAsset[]>;
  isOnline?: boolean;
  resolveOfflineBlobLabel?: (blobId: string) => Promise<string | null>;
  renderOfflineBlobPreview?: (props: {
    blobId: string;
    alt: string;
    className?: string;
  }) => ReactNode;
  strings?: Partial<FileUploadStrings>;
  isNetworkDisconnectError?: (error: unknown) => boolean;
}
