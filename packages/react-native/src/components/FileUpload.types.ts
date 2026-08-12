import type { StyleProp, ViewStyle } from 'react-native';
import type { PickedFile } from '../utils/filePickerModules';

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
  takePhoto: string;
  chooseFromLibrary: string;
  chooseFile: string;
  pickerNotConfigured: string;
  cameraPermissionDenied: string;
  libraryPermissionDenied: string;
  chooseSource: string;
}

export const DEFAULT_FILE_UPLOAD_STRINGS: FileUploadStrings = {
  clickToUpload: 'Tap to upload or take a photo',
  browse: 'Choose file',
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
  takePhoto: 'Take photo',
  chooseFromLibrary: 'Photo library',
  chooseFile: 'Browse files',
  pickerNotConfigured:
    'File picker is not configured. Call registerFilePickerModules() with expo-document-picker and expo-image-picker.',
  cameraPermissionDenied: 'Camera permission is required to take a photo.',
  libraryPermissionDenied: 'Photo library permission is required.',
  chooseSource: 'Add file',
};

export interface FileUploadProps {
  onFileSelect: (file: PickedFile | null) => void;
  accept?: string;
  maxSizeMB?: number;
  style?: StyleProp<ViewStyle>;
  label?: string;
  helperText?: string;
  error?: string;
  autoUpload?: boolean;
  multiple?: boolean;
  onUploadStart?: () => void;
  onUploadComplete?: (assets: UploadedFileAsset[], file: PickedFile) => void;
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
  offlineSaveFn?: (files: PickedFile[]) => Promise<UploadedFileAsset[]>;
  isOnline?: boolean;
  strings?: Partial<FileUploadStrings>;
  isNetworkDisconnectError?: (error: unknown) => boolean;
}
