import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  Linking,
  View,
} from 'react-native';
import { DismissKeyboardPressable } from './DismissKeyboardPressable';
import {
  DEFAULT_FILE_UPLOAD_STRINGS,
  type FileUploadProps,
  type UploadedFileAsset,
} from './FileUpload.types';
import {
  acceptAllowsImages,
  acceptToDocumentPickerTypes,
  formatAcceptDisplay,
  formatFileSize,
  isImageAsset,
  isNetworkDisconnectError as defaultIsNetworkDisconnectError,
  normalizeValue,
  validatePickedFileAgainstAccept,
} from './fileUploadUtils';
import { DocumentText, Eye, Icon, TickCircle } from './Icon';
import { Modal } from './Modal';
import { Sheet } from './Sheet';
import { Spinner } from './Spinner';
import { Text } from './Text';
import { useResolvedScheme, useThemeColors } from '../theme/ThemeProvider';
import { fieldErrorStyle, fieldLabelStyle } from '../styles/formStyles';
import { triggerHapticFeedback } from '../utils/haptics';
import {
  documentAssetToPickedFile,
  getDocumentPickerModule,
  getImagePickerModule,
  imageAssetToPickedFile,
  pickDocumentAsync,
  pickedFileToFormDataPart,
  type PickedFile,
} from '../utils/filePickerModules';

export type {
  FileUploadProps,
  FileUploadStrings,
  UploadedFileAsset,
} from './FileUpload.types';
export { ALL_DOCUMENT_UPLOAD_ACCEPT } from './fileUploadUtils';
export {
  registerFilePickerModules,
  getDocumentPickerModule,
  getImagePickerModule,
  pickDocumentAsync,
  type PickedFile,
} from '../utils/filePickerModules';

type DisplayItem = {
  key: string;
  source: 'prefilled' | 'selected';
  index: number;
  name: string;
  sizeText: string;
  url: string;
};

export function FileUpload({
  onFileSelect,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 5,
  style,
  label,
  helperText,
  error: errorProp,
  autoUpload = false,
  multiple = false,
  onUploadStart,
  onUploadComplete,
  onUploadError,
  value,
  onDeleteFile,
  onDeleteFileAtIndex,
  showAssetPreviewGrid = false,
  applyWatermark = false,
  allowOfflineSave = false,
  uploadFn,
  offlineSaveFn,
  isOnline = true,
  strings: stringsOverride,
  isNetworkDisconnectError = defaultIsNetworkDisconnectError,
}: FileUploadProps) {
  const colors = useThemeColors();
  const scheme = useResolvedScheme();
  const actionAccent = scheme === 'dark' ? colors.destructive : colors.brand;
  const strings = useMemo(
    () => ({ ...DEFAULT_FILE_UPLOAD_STRINGS, ...stringsOverride }),
    [stringsOverride],
  );

  const [sourceOpen, setSourceOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<PickedFile[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [uploadedLabels, setUploadedLabels] = useState<string[]>([]);
  const [locallyRemovedPrefilled, setLocallyRemovedPrefilled] = useState<Set<number>>(
    new Set(),
  );

  const prefilled = useMemo(() => normalizeValue(value), [value]);
  const visiblePrefilled = useMemo(
    () => prefilled.filter((_, idx) => !locallyRemovedPrefilled.has(idx)),
    [prefilled, locallyRemovedPrefilled],
  );
  const acceptDisplay = useMemo(() => formatAcceptDisplay(accept), [accept]);
  const hasFile = !!(selectedFiles.length > 0 || visiblePrefilled.length > 0);
  const allowsImages = acceptAllowsImages(accept);
  const selectedOffset = visiblePrefilled.length;

  const documentPicker = getDocumentPickerModule();
  const imagePicker = getImagePickerModule();

  const displayItems = useMemo<DisplayItem[]>(
    () => [
      ...visiblePrefilled.map((item, idx) => ({
        key: `prefilled-${idx}`,
        source: 'prefilled' as const,
        index: idx,
        name: item.label,
        sizeText: strings.uploaded,
        url: item.url,
      })),
      ...selectedFiles.map((file, idx) => ({
        key: `selected-${idx}`,
        source: 'selected' as const,
        index: idx,
        name: uploadedLabels[idx] || file.name,
        sizeText: formatFileSize(file.size),
        url: file.uri,
      })),
    ],
    [visiblePrefilled, selectedFiles, uploadedLabels, strings.uploaded],
  );

  useEffect(() => {
    setLocallyRemovedPrefilled(new Set());
  }, [value]);

  const validateFile = useCallback(
    (file: PickedFile): boolean => {
      const code = validatePickedFileAgainstAccept(file, accept, maxSizeMB);
      if (code === 'invalidType') {
        setLocalError(strings.invalidType);
        return false;
      }
      if (code === 'fileTooLarge') {
        setLocalError(strings.fileTooLarge);
        return false;
      }
      setLocalError(null);
      return true;
    },
    [accept, maxSizeMB, strings.fileTooLarge, strings.invalidType],
  );

  const applyOfflineAssets = useCallback(
    (files: PickedFile[], assets: UploadedFileAsset[], startIndex: number) => {
      setUploadedLabels((prev) => {
        const next = [...prev];
        assets.forEach((asset, i) => {
          const fileUrl = asset?.fileUrl ?? '';
          const label =
            fileUrl.split('/').filter(Boolean).pop() ?? files[i]?.name ?? fileUrl;
          next[startIndex + i] = label;
        });
        return next;
      });
      onUploadComplete?.(assets, files[0]!);
    },
    [onUploadComplete],
  );

  const uploadSelectedFiles = useCallback(
    async (files: PickedFile[], startIndex = 0) => {
      if (!autoUpload || files.length === 0) return;
      if (!uploadFn && !offlineSaveFn) return;

      const runOfflineSave = async () => {
        if (!offlineSaveFn) {
          throw new Error('Network offline');
        }
        const assets = await offlineSaveFn(files);
        applyOfflineAssets(files, assets, startIndex);
      };

      try {
        onUploadStart?.();
        setIsUploading(true);
        setLocalError(null);

        const canSaveOffline = allowOfflineSave || Boolean(offlineSaveFn);

        if (!isOnline) {
          if (canSaveOffline && offlineSaveFn) {
            await runOfflineSave();
            return;
          }
          return;
        }

        if (!uploadFn) return;

        const formData = new FormData();
        for (const file of files) {
          formData.append('files', pickedFileToFormDataPart(file) as never);
        }
        const assets = await uploadFn(formData, { applyWatermark });
        applyOfflineAssets(files, assets, startIndex);
      } catch (err) {
        const disconnected = !isOnline || isNetworkDisconnectError(err);
        if (disconnected && (allowOfflineSave || Boolean(offlineSaveFn)) && offlineSaveFn) {
          try {
            await runOfflineSave();
            return;
          } catch {
            // Still offline — keep the local file, skip the retry error.
            return;
          }
        }
        if (disconnected) return;
        setLocalError(strings.uploadFailed);
        onUploadError?.(err);
      } finally {
        setIsUploading(false);
      }
    },
    [
      allowOfflineSave,
      applyOfflineAssets,
      applyWatermark,
      autoUpload,
      isNetworkDisconnectError,
      isOnline,
      offlineSaveFn,
      onUploadError,
      onUploadStart,
      strings.uploadFailed,
      uploadFn,
    ],
  );

  const ingestFiles = useCallback(
    (raw: PickedFile[]) => {
      const validFiles = raw.filter((file) => validateFile(file));
      if (validFiles.length === 0) return;

      const nextFiles = multiple ? validFiles : [validFiles[0]!];
      const startIndex = multiple ? selectedFiles.length : 0;
      setSelectedFiles((prev) => (multiple ? [...prev, ...nextFiles] : nextFiles));
      if (!multiple) {
        setUploadedLabels([]);
      }
      onFileSelect(nextFiles[0]!);
      void uploadSelectedFiles(nextFiles, startIndex);
    },
    [multiple, onFileSelect, selectedFiles.length, uploadSelectedFiles, validateFile],
  );

  const pickFromDocuments = async () => {
    if (isPicking) return;
    setSourceOpen(false);
    if (!documentPicker) {
      setLocalError(strings.pickerNotConfigured);
      return;
    }
    setIsPicking(true);
    try {
      const result = await pickDocumentAsync(documentPicker, {
        type: acceptToDocumentPickerTypes(accept),
        multiple,
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.length) return;
      ingestFiles(result.assets.map(documentAssetToPickedFile));
    } catch {
      setLocalError(strings.uploadFailed);
    } finally {
      setIsPicking(false);
    }
  };

  const pickFromLibrary = async () => {
    if (isPicking) return;
    setSourceOpen(false);
    if (!imagePicker) {
      setLocalError(strings.pickerNotConfigured);
      return;
    }
    setIsPicking(true);
    try {
      if (imagePicker.requestMediaLibraryPermissionsAsync) {
        const permission = await imagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          setLocalError(strings.libraryPermissionDenied);
          return;
        }
      }
      const result = await imagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: multiple,
        quality: 0.9,
      });
      if (result.canceled || !result.assets?.length) return;
      ingestFiles(result.assets.map(imageAssetToPickedFile));
    } finally {
      setIsPicking(false);
    }
  };

  const takePhoto = async () => {
    if (isPicking) return;
    setSourceOpen(false);
    if (!imagePicker) {
      setLocalError(strings.pickerNotConfigured);
      return;
    }
    setIsPicking(true);
    try {
      const permission = await imagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setLocalError(strings.cameraPermissionDenied);
        return;
      }
      const result = await imagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.9,
      });
      if (result.canceled || !result.assets?.length) return;
      ingestFiles(result.assets.map(imageAssetToPickedFile));
    } finally {
      setIsPicking(false);
    }
  };

  const openSourcePicker = () => {
    if (isPicking || isUploading) return;
    if (!documentPicker && !imagePicker) {
      setLocalError(strings.pickerNotConfigured);
      return;
    }
    triggerHapticFeedback('light');

    const sourceCount =
      (documentPicker ? 1 : 0) +
      (allowsImages && imagePicker ? 2 : 0);

    if (sourceCount === 1 && documentPicker) {
      void pickFromDocuments();
      return;
    }

    setSourceOpen(true);
  };

  const removeFile = () => {
    setSelectedFiles([]);
    onFileSelect(null);
    setLocalError(null);
    setUploadedLabels([]);
    setLocallyRemovedPrefilled(new Set());
    onDeleteFile?.();
  };

  const removeItem = (source: 'prefilled' | 'selected', index: number) => {
    if (source === 'selected') {
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
      setUploadedLabels((prev) => prev.filter((_, i) => i !== index));
      onDeleteFileAtIndex?.(index, source);
      return;
    }

    const absoluteIndex = prefilled.findIndex(
      (item, prefilledIdx) =>
        !locallyRemovedPrefilled.has(prefilledIdx) &&
        visiblePrefilled[index] != null &&
        item.url === visiblePrefilled[index]!.url,
    );
    setLocallyRemovedPrefilled((prev) => {
      const next = new Set(prev);
      if (absoluteIndex >= 0) next.add(absoluteIndex);
      return next;
    });
    onDeleteFileAtIndex?.(absoluteIndex >= 0 ? absoluteIndex : index, source);
  };

  const openPreview = (item: DisplayItem) => {
    const imageLike = isImageAsset(item.name) || isImageAsset(item.url);
    if (imageLike) {
      setPreviewUri(item.url);
      setPreviewOpen(true);
      return;
    }
    void Linking.openURL(item.url);
  };

  const displayError = errorProp || localError;

  const sourceOption = (title: string, onPress: () => void | Promise<void>) => (
    <DismissKeyboardPressable
      key={title}
      accessibilityRole="button"
      disabled={isPicking}
      onPress={() => {
        if (isPicking) return;
        triggerHapticFeedback('selection');
        void onPress();
      }}
      style={{
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Text variant="open-regular-p" style={{ color: colors.fg }}>
        {title}
      </Text>
    </DismissKeyboardPressable>
  );

  const renderListRow = (item: DisplayItem, idx: number) => {
    const isSelected = item.source === 'selected';
    const selectedIndex = isSelected ? item.index : idx - selectedOffset;
    const showUploadedIcon = !isSelected || Boolean(uploadedLabels[item.index]);
    const imageLike = isImageAsset(item.name) || isImageAsset(item.url);

    return (
      <View
        key={item.key}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingVertical: 4,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            backgroundColor: colors.muted + '33',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {imageLike ? (
            <Image source={{ uri: item.url }} style={{ width: 40, height: 40 }} resizeMode="cover" />
          ) : (
            <Icon icon={DocumentText} size="sm" color="brand" />
          )}
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text variant="open-regular-p" style={{ color: colors.fg }} numberOfLines={1}>
            {item.name}
          </Text>
          <Text variant="open-regular-tiny" muted>
            {item.sizeText}
          </Text>
        </View>
        {isSelected && isUploading && selectedIndex === selectedFiles.length - 1 ? (
          <Spinner size={20} />
        ) : null}
        {showUploadedIcon ? (
          <TickCircle size={16} color={actionAccent} variant="Bold" />
        ) : null}
        <DismissKeyboardPressable
          accessibilityRole="button"
          accessibilityLabel={strings.preview}
          hitSlop={8}
          onPress={() => openPreview(item)}
          disabled={isUploading}
        >
          <Icon icon={Eye} size="sm" color="muted" />
        </DismissKeyboardPressable>
        <DismissKeyboardPressable
          accessibilityRole="button"
          onPress={() => removeItem(item.source, item.index)}
          disabled={isUploading}
        >
          <Text variant="open-regular-tiny" style={{ color: colors.destructive, fontWeight: '600' }}>
            {strings.remove}
          </Text>
        </DismissKeyboardPressable>
      </View>
    );
  };

  const renderGridTile = (item: DisplayItem, idx: number) => {
    const isSelected = item.source === 'selected';
    const imageLike = isImageAsset(item.name) || isImageAsset(item.url);
    const selectedIndex = isSelected ? item.index : idx - selectedOffset;
    const showUploadedIcon = !isSelected || Boolean(uploadedLabels[item.index]);

    return (
      <DismissKeyboardPressable
        key={item.key}
        accessibilityRole="button"
        accessibilityLabel={`${strings.preview} ${item.name}`}
        onPress={() => openPreview(item)}
        style={{
          aspectRatio: 1,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: 'hidden',
          backgroundColor: colors.bg,
        }}
      >
        {imageLike ? (
          <Image source={{ uri: item.url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 8 }}>
            <Icon icon={DocumentText} size="md" color="muted" />
            <Text variant="open-regular-tiny" muted numberOfLines={2} style={{ marginTop: 8, textAlign: 'center' }}>
              {item.name}
            </Text>
          </View>
        )}
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: 8,
            backgroundColor: 'rgba(0,0,0,0.55)',
          }}
        >
          <Text variant="open-regular-tiny" style={{ color: '#fff' }} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        {isSelected && isUploading && selectedIndex === selectedFiles.length - 1 ? (
          <View style={{ position: 'absolute', top: 8, right: 8 }}>
            <Spinner size={16} />
          </View>
        ) : null}
        {showUploadedIcon ? (
          <View style={{ position: 'absolute', top: 8, left: 8 }}>
            <TickCircle size={13} color={actionAccent} variant="Bold" />
          </View>
        ) : null}
        <DismissKeyboardPressable
          accessibilityRole="button"
          onPress={(e) => {
            e.stopPropagation?.();
            removeItem(item.source, item.index);
          }}
          style={{ position: 'absolute', top: 8, right: 8, padding: 4 }}
        >
          <Text variant="open-regular-tiny" style={{ color: colors.destructive, fontWeight: '700' }}>
            {strings.remove}
          </Text>
        </DismissKeyboardPressable>
      </DismissKeyboardPressable>
    );
  };

  return (
    <View style={style}>
      {label ? (
        <Text variant="open-regular-label" style={fieldLabelStyle(colors)}>
          {label}
        </Text>
      ) : null}

      {!hasFile ? (
        <DismissKeyboardPressable
          accessibilityRole="button"
          onPress={openSourcePicker}
          disabled={isUploading || isPicking}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderStyle: 'dashed',
            borderRadius: 8,
            borderColor: displayError ? colors.error : colors.border,
            backgroundColor: colors.bg,
            paddingVertical: 32,
            paddingHorizontal: 16,
            opacity: isUploading || isPicking ? 0.6 : 1,
          }}
        >
          <Text variant="open-regular-p" muted style={{ marginBottom: 8, textAlign: 'center' }}>
            {strings.clickToUpload}
          </Text>
          <Text
            variant="open-regular-tiny"
            muted
            style={{ marginBottom: 24, textAlign: 'center', textTransform: 'uppercase' }}
          >
            {helperText || acceptDisplay}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
            }}>
            {isUploading ? <Spinner size={16} /> : null}
            <Text variant="open-regular-p" style={{ color: actionAccent, fontWeight: '600' }}>
              {isUploading ? strings.browseUploading : strings.browse}
            </Text>
          </View>
        </DismissKeyboardPressable>
      ) : (
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            backgroundColor: colors.bg,
            padding: 16,
            gap: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text variant="open-regular-label" style={{ color: colors.muted, fontWeight: '500' }}>
              {strings.files}
            </Text>
            <DismissKeyboardPressable accessibilityRole="button" onPress={removeFile} disabled={isUploading}>
              <Text variant="open-regular-tiny" style={{ color: colors.destructive, fontWeight: '600' }}>
                {strings.clear}
                {selectedFiles.length > 1 ? ` ${strings.all}` : ''}
              </Text>
            </DismissKeyboardPressable>
          </View>

          {showAssetPreviewGrid ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {displayItems.map((item, idx) => (
                <View key={item.key} style={{ width: '47%' }}>
                  {renderGridTile(item, idx)}
                </View>
              ))}
            </View>
          ) : (
            displayItems.map((item, idx) => renderListRow(item, idx))
          )}

          {multiple ? (
            <DismissKeyboardPressable accessibilityRole="button" onPress={openSourcePicker} disabled={isUploading || isPicking}>
              <Text variant="open-regular-tiny" style={{ color: actionAccent, fontWeight: '600' }}>
                {strings.addMore}
              </Text>
            </DismissKeyboardPressable>
          ) : null}
        </View>
      )}

      {displayError ? (
        <View style={{ marginTop: 6, gap: 8 }}>
          <Text variant="open-regular-tiny" style={fieldErrorStyle(colors)}>
            {displayError}
          </Text>
          {selectedFiles.length > 0 && autoUpload ? (
            <DismissKeyboardPressable
              accessibilityRole="button"
              onPress={() => {
                setLocalError(null);
                void uploadSelectedFiles(selectedFiles);
              }}
              disabled={isUploading}
            >
              <Text variant="open-regular-tiny" style={{ color: colors.brand, fontWeight: '500' }}>
                {strings.retry}
              </Text>
            </DismissKeyboardPressable>
          ) : null}
        </View>
      ) : null}

      <Sheet open={sourceOpen} onClose={() => setSourceOpen(false)}>
        <View style={{ gap: 4 }}>
          <Text variant="spline-bold-h5" style={{ color: colors.fg, marginBottom: 8 }}>
            {strings.chooseSource}
          </Text>
          {allowsImages && imagePicker ? sourceOption(strings.takePhoto, takePhoto) : null}
          {allowsImages && imagePicker ? sourceOption(strings.chooseFromLibrary, pickFromLibrary) : null}
          {documentPicker ? sourceOption(strings.chooseFile, pickFromDocuments) : null}
        </View>
      </Sheet>

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)}>
        {previewUri ? (
          <Image
            source={{ uri: previewUri }}
            style={{ width: '100%', height: 320, borderRadius: 8 }}
            resizeMode="contain"
          />
        ) : null}
      </Modal>
    </View>
  );
}
