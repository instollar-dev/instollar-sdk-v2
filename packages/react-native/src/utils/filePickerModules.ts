export type PickedFile = {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
};

export type DocumentPickerAsset = {
  uri: string;
  name?: string;
  mimeType?: string;
  size?: number;
};

export type ImagePickerAsset = {
  uri: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
};

export type DocumentPickerModule = {
  getDocumentAsync: (options?: {
    type?: string | string[];
    multiple?: boolean;
    copyToCacheDirectory?: boolean;
  }) => Promise<{
    canceled: boolean;
    assets?: DocumentPickerAsset[];
  }>;
};

export type ImagePickerModule = {
  requestCameraPermissionsAsync: () => Promise<{ granted: boolean; status?: string }>;
  requestMediaLibraryPermissionsAsync?: () => Promise<{ granted: boolean; status?: string }>;
  launchCameraAsync: (options?: {
    mediaTypes?: string | string[];
    allowsEditing?: boolean;
    quality?: number;
  }) => Promise<{
    canceled: boolean;
    assets?: ImagePickerAsset[];
  }>;
  launchImageLibraryAsync: (options?: {
    mediaTypes?: string | string[];
    allowsMultipleSelection?: boolean;
    quality?: number;
  }) => Promise<{
    canceled: boolean;
    assets?: ImagePickerAsset[];
  }>;
};

const PICKER_GLOBAL_KEY = '__INSTOLLAR_FILE_PICKER_MODULES__';

type PickerGlobal = typeof globalThis & {
  [PICKER_GLOBAL_KEY]?: {
    documentPicker?: DocumentPickerModule | null;
    imagePicker?: ImagePickerModule | null;
  };
};

let cachedModules:
  | {
      documentPicker?: DocumentPickerModule | null;
      imagePicker?: ImagePickerModule | null;
    }
  | undefined;

/**
 * Register the host app's Expo picker modules.
 *
 * Required for Expo/Metro — the prebundled SDK cannot safely
 * `require('expo-document-picker')` / `require('expo-image-picker')` at runtime.
 *
 * @example
 * ```ts
 * import * as DocumentPicker from 'expo-document-picker';
 * import * as ImagePicker from 'expo-image-picker';
 * import { registerFilePickerModules } from '@instollar-dev/instollar-react-native';
 *
 * registerFilePickerModules({ documentPicker: DocumentPicker, imagePicker: ImagePicker });
 * ```
 */
export function registerFilePickerModules(modules: {
  documentPicker?: DocumentPickerModule | null;
  imagePicker?: ImagePickerModule | null;
}): void {
  (globalThis as PickerGlobal)[PICKER_GLOBAL_KEY] = modules;
  cachedModules = modules;
}

export function getDocumentPickerModule(): DocumentPickerModule | null {
  if (cachedModules !== undefined) {
    return cachedModules.documentPicker ?? null;
  }
  const injected = (globalThis as PickerGlobal)[PICKER_GLOBAL_KEY];
  if (injected !== undefined) {
    cachedModules = injected;
    return injected.documentPicker ?? null;
  }
  cachedModules = {};
  return null;
}

export function getImagePickerModule(): ImagePickerModule | null {
  if (cachedModules !== undefined) {
    return cachedModules.imagePicker ?? null;
  }
  const injected = (globalThis as PickerGlobal)[PICKER_GLOBAL_KEY];
  if (injected !== undefined) {
    cachedModules = injected;
    return injected.imagePicker ?? null;
  }
  cachedModules = {};
  return null;
}

export function documentAssetToPickedFile(asset: DocumentPickerAsset): PickedFile {
  const name = asset.name?.trim() || asset.uri.split('/').pop() || 'file';
  return {
    uri: asset.uri,
    name,
    mimeType: asset.mimeType,
    size: asset.size,
  };
}

export function imageAssetToPickedFile(asset: ImagePickerAsset): PickedFile {
  const name =
    asset.fileName?.trim() ||
    asset.uri.split('/').pop() ||
    `photo-${Date.now()}.jpg`;
  return {
    uri: asset.uri,
    name,
    mimeType: asset.mimeType ?? 'image/jpeg',
    size: asset.fileSize,
  };
}

export function pickedFileToFormDataPart(file: PickedFile) {
  return {
    uri: file.uri,
    name: file.name,
    type: file.mimeType ?? 'application/octet-stream',
  } as unknown as Blob;
}
