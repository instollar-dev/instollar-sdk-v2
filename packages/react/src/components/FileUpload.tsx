import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FC,
} from 'react';
import { cn } from '../utils/cn';
import { sharedApi } from '@instollar-dev/instollar-core';
import { Button } from './Button';
import {
  DEFAULT_FILE_UPLOAD_STRINGS,
  type FileUploadProps,
  type UploadedFileAsset,
} from './FileUpload.types';
import {
  formatAcceptDisplay,
  formatFileSize,
  isImageAsset,
  isNetworkDisconnectError as defaultIsNetworkDisconnectError,
  isVideoAsset,
  normalizeValue,
  offlineBlobIdFromUrl,
  validateFileAgainstAccept,
} from './fileUploadUtils';
import { DocumentText, Eye, Icon, TickCircle } from './Icon';
import { Spinner } from './Spinner';

export type {
  FileUploadProps,
  FileUploadStrings,
  UploadedFileAsset,
} from './FileUpload.types';
export { ALL_DOCUMENT_UPLOAD_ACCEPT } from './fileUploadUtils';

function OfflineBlobPlaceholder({
  blobId,
  alt,
  className,
  renderOfflineBlobPreview,
}: {
  blobId: string;
  alt: string;
  className?: string;
  renderOfflineBlobPreview?: FileUploadProps['renderOfflineBlobPreview'];
}) {
  if (renderOfflineBlobPreview) {
    return <>{renderOfflineBlobPreview({ blobId, alt, className })}</>;
  }
  return <div className={cn(className, 'animate-pulse bg-muted')} aria-hidden />;
}

export const FileUpload: FC<FileUploadProps> = ({
  onFileSelect,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 5,
  className,
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
  variant = 'default',
  uploadFn,
  offlineSaveFn,
  isOnline = true,
  resolveOfflineBlobLabel,
  renderOfflineBlobPreview,
  strings: stringsOverride,
  isNetworkDisconnectError = defaultIsNetworkDisconnectError,
}) => {
  const strings = useMemo(
    () => ({ ...DEFAULT_FILE_UPLOAD_STRINGS, ...stringsOverride }),
    [stringsOverride],
  );

  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedLabels, setUploadedLabels] = useState<string[]>([]);
  const [locallyRemovedPrefilled, setLocallyRemovedPrefilled] = useState<Set<number>>(
    new Set(),
  );
  const [blobFilenames, setBlobFilenames] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const prefilled = useMemo(() => normalizeValue(value), [value]);
  const visiblePrefilled = useMemo(
    () => prefilled.filter((_, idx) => !locallyRemovedPrefilled.has(idx)),
    [prefilled, locallyRemovedPrefilled],
  );
  const acceptDisplay = useMemo(() => formatAcceptDisplay(accept), [accept]);
  const hasFile = !!(selectedFiles.length > 0 || visiblePrefilled.length > 0);
  const selectedPreviewUrls = useMemo(
    () => selectedFiles.map((file) => URL.createObjectURL(file)),
    [selectedFiles],
  );
  const selectedOffset = visiblePrefilled.length;

  const displayItems = useMemo(
    () => [
      ...visiblePrefilled.map((item, idx) => {
        let displayName = item.label;
        const blobId = offlineBlobIdFromUrl(item.url);
        if (blobId && blobFilenames[blobId]) {
          displayName = blobFilenames[blobId];
        }
        return {
          key: `prefilled-${idx}`,
          source: 'prefilled' as const,
          index: idx,
          name: displayName,
          sizeText: strings.uploaded,
          url: item.url,
        };
      }),
      ...selectedFiles
        .map((file, idx) => ({ file, idx }))
        .filter(({ file, idx }) => {
          const uploadedLabel = uploadedLabels[idx];
          if (!uploadedLabel) return true;
          return !visiblePrefilled.some(
            (prefill) =>
              prefill.label === uploadedLabel ||
              prefill.url === uploadedLabel ||
              (prefill.url.startsWith('offline-blob:') && prefill.label === file.name) ||
              (prefill.url.startsWith('offline-blob:') && uploadedLabel === file.name),
          );
        })
        .map(({ file, idx }) => ({
          key: `selected-${idx}`,
          source: 'selected' as const,
          index: idx,
          name: uploadedLabels[idx] || file.name,
          sizeText: formatFileSize(file.size),
          url: selectedPreviewUrls[idx] || '',
        })),
    ],
    [
      visiblePrefilled,
      selectedFiles,
      uploadedLabels,
      selectedPreviewUrls,
      strings.uploaded,
      blobFilenames,
    ],
  );

  useEffect(() => {
    if (!resolveOfflineBlobLabel) return;
    const offlinePrefilled = visiblePrefilled.filter((p) => p.url.startsWith('offline-blob:'));
    if (!offlinePrefilled.length) return;

    let cancelled = false;
    void (async () => {
      const newFilenames: Record<string, string> = {};
      await Promise.all(
        offlinePrefilled.map(async (p) => {
          const blobId = offlineBlobIdFromUrl(p.url);
          if (!blobId) return;
          const name = await resolveOfflineBlobLabel(blobId);
          if (name) newFilenames[blobId] = name;
        }),
      );
      if (!cancelled) {
        setBlobFilenames((prev) => ({ ...prev, ...newFilenames }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [visiblePrefilled, resolveOfflineBlobLabel]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      selectedPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedPreviewUrls]);

  useEffect(() => {
    setLocallyRemovedPrefilled(new Set());
  }, [value]);

  const validateFile = useCallback(
    (file: File): boolean => {
      const code = validateFileAgainstAccept(file, accept, maxSizeMB);
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
    (files: File[], assets: UploadedFileAsset[], startIndex: number) => {
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
    async (files: File[], startIndex = 0) => {
      if (!autoUpload || files.length === 0) return;

      const activeUploadFn = uploadFn || (async (fd: FormData, opts?: { applyWatermark?: boolean }) => {
        const res = await sharedApi.uploadFiles(fd, opts);
        return res.data ?? [];
      });

      if (!activeUploadFn && !offlineSaveFn) return;

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

        if (!isOnline) {
          if (allowOfflineSave) {
            await runOfflineSave();
            return;
          }
          throw new Error('Network offline');
        }

        const formData = new FormData();
        for (const file of files) {
          let uploadBlob: Blob = file;
          const filename = file.name;
          if (filename.toLowerCase().endsWith('.svg')) {
            uploadBlob = new Blob([file], { type: 'image/svg+xml' });
          }
          formData.append('files', uploadBlob, filename);
        }
        const assets = await activeUploadFn(formData, { applyWatermark });
        applyOfflineAssets(files, assets, startIndex);
      } catch (err) {
        if (allowOfflineSave && offlineSaveFn && isNetworkDisconnectError(err)) {
          await runOfflineSave();
          return;
        }
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

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const ingestFiles = (raw: File[]) => {
    const validFiles = raw.filter((file) => validateFile(file));
    if (validFiles.length === 0) return;
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    const nextFiles = multiple ? validFiles : [validFiles[0]!];
    const startIndex = multiple ? selectedFiles.length : 0;
    setSelectedFiles((prev) => (multiple ? [...prev, ...nextFiles] : nextFiles));
    if (!multiple) {
      setUploadedLabels([]);
    }
    onFileSelect(nextFiles[0]!);
    void uploadSelectedFiles(nextFiles, startIndex);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      ingestFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.length) {
      ingestFiles(Array.from(e.target.files));
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const removeFile = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setSelectedFiles([]);
    onFileSelect(null);
    setLocalError(null);
    setUploadedLabels([]);
    setLocallyRemovedPrefilled(new Set());
    if (inputRef.current) {
      inputRef.current.value = '';
    }
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

  const openPreview = (item: { source: 'prefilled' | 'selected'; index: number; url: string }) => {
    if (item.source === 'selected') {
      const file = selectedFiles[item.index];
      if (file) {
        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
        }
        const url = URL.createObjectURL(file);
        previewUrlRef.current = url;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    if (item.url && !item.url.startsWith('offline-blob:')) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const renderGridTile = (item: (typeof displayItems)[number], idx: number) => {
    const isSelected = item.source === 'selected';
    const imageLike = isImageAsset(item.name) || isImageAsset(item.url);
    const videoLike = isVideoAsset(item.name) || isVideoAsset(item.url);
    const selectedIndex = isSelected ? item.index : idx - selectedOffset;
    const showUploadedIcon = !isSelected || Boolean(uploadedLabels[item.index]);
    const blobId = offlineBlobIdFromUrl(item.url);

    return (
      <button
        key={item.key}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          openPreview(item);
        }}
        className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-background text-left"
        title={strings.preview}
        aria-label={`${strings.preview} ${item.name}`}
      >
        {imageLike ? (
          blobId ? (
            <OfflineBlobPlaceholder
              blobId={blobId}
              alt={item.name}
              className="h-full w-full object-cover"
              renderOfflineBlobPreview={renderOfflineBlobPreview}
            />
          ) : (
            <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
          )
        ) : videoLike ? (
          <video src={item.url} className="h-full w-full object-cover" muted playsInline />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2 text-muted">
            <Icon icon={DocumentText} size="md" color="muted" />
            <span className="w-full truncate text-center text-[10px]">{item.name}</span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-2 text-white">
          <p className="truncate text-[10px]">{item.name}</p>
        </div>

        {isSelected && isUploading && selectedIndex === selectedFiles.length - 1 ? (
          <div className="absolute right-2 top-2 rounded-full bg-background/90 p-1 text-primary">
            <Spinner size={14} className="text-primary" />
          </div>
        ) : null}

        {showUploadedIcon ? (
          <div className="absolute left-2 top-2 rounded-full bg-background/90 p-0.5 text-primary">
            <Icon icon={TickCircle} size="xs" color="primary" variant="Bold" />
          </div>
        ) : null}

        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeItem(item.source, item.index);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              removeItem(item.source, item.index);
            }
          }}
          className="absolute right-2 top-2 rounded-full bg-background/95 px-1.5 py-0.5 text-[10px] font-semibold text-destructive opacity-0 transition-opacity group-hover:opacity-100"
        >
          {strings.remove}
        </span>
      </button>
    );
  };

  const displayError = errorProp || localError;

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {!hasFile ? (
        variant === "input" ? (
          <div
            className={cn(
              "flex items-center justify-between border rounded-sm px-3 py-2 bg-white cursor-pointer transition-colors w-full h-11",
              dragActive ? "border-primary bg-primary/5" : "border-border hover:border-gray-400",
              displayError ? "border-red-500" : ""
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleChange}
              accept={accept}
              multiple={multiple}
            />
            <span className="text-sm text-gray-500 truncate flex-1 pr-2">
              {helperText || strings.clickToUploadInput}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted shrink-0"
            >
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="M12 12v9" />
              <path d="m16 16-4-4-4 4" />
            </svg>
          </div>
        ) : (
          <div
            className={cn(
              "border border-dashed rounded-lg flex flex-col items-center justify-center p-8 text-center transition-colors relative cursor-pointer",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 bg-white hover:bg-gray-50",
              displayError ? "border-red-500" : "",
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleChange}
              accept={accept}
              multiple={multiple}
            />

            <div className="mb-4 text-[#F49E0C]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="M12 12v9" />
                <path d="m16 16-4-4-4 4" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm mb-2">
              {strings.clickToUpload}
            </p>
            <p className="text-gray-500 text-xs mb-6 uppercase">
              {helperText || acceptDisplay}
            </p>

            <Button
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick();
              }}
              className="px-6 py-2 text-xs font-light text-foreground border border-foreground pointer-events-auto hover:bg-muted/10 rounded-md"
              disabled={isUploading}
            >
              {isUploading
                ? strings.browseUploading
                : strings.browse}
            </Button>
          </div>
        )
      ) : (
        <div className="border border-border rounded-lg p-4 flex flex-col gap-3 bg-white">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept={accept}
            multiple={multiple}
          />
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">{strings.files}</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                disabled={isUploading}
                aria-label={strings.clearAll}
              >
                <span className="text-xs text-red-500 font-semibold">
                  {strings.clear}
                  {selectedFiles.length > 1 ? ` ${strings.all}` : ""}
                </span>
              </button>
            </div>
          </div>
          {showAssetPreviewGrid ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {displayItems.map((item, idx) => renderGridTile(item, idx))}
            </div>
          ) : (
            displayItems.map((item, idx) => {
              const isSelected = item.source === "selected";
              const selectedIndex = isSelected
                ? item.index
                : idx - selectedOffset;
              const showUploadedIcon =
                !isSelected || Boolean(uploadedLabels[item.index]);

              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-4 flex-1 overflow-hidden">
                    <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-primary shrink-0">
                      <Icon icon={DocumentText} size="sm" color="current" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.name}
                      </p>
                      <span className="text-xs text-gray-400">
                        {item.sizeText}
                      </span>
                    </div>
                  </div>

                  {isSelected &&
                    isUploading &&
                    selectedIndex === selectedFiles.length - 1 && (
                      <div
                        className="flex items-center justify-center shrink-0 text-primary"
                        aria-label="Uploading"
                      >
                        <Spinner size={20} className="text-current" />
                      </div>
                    )}

                  {showUploadedIcon && (
                    <div
                      className="flex items-center justify-center shrink-0 text-green-600"
                      aria-label="Uploaded"
                    >
                      <Icon icon={TickCircle} size="sm" color="current" variant="Bold" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPreview(item);
                    }}
                    className="text-gray-500 hover:text-primary transition-colors p-2 disabled:opacity-50 flex items-center justify-center"
                    disabled={isUploading}
                    title={strings.preview}
                    aria-label={strings.preview}
                  >
                    <Icon icon={Eye} size="sm" color="current" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.source, item.index);
                    }}
                    className="text-xs text-red-500 hover:text-red-600 font-semibold"
                    disabled={isUploading}
                  >
                    {strings.remove}
                  </button>
                </div>
              );
            })
          )}
          {multiple && (
            <div className="mt-2 flex justify-start">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onButtonClick();
                }}
                className="text-xs text-primary font-semibold hover:underline disabled:opacity-50"
                disabled={isUploading}
              >
                {strings.addMore}
              </button>
            </div>
          )}
        </div>
      )}

      {displayError && (
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          <p className="text-xs text-red-500">{displayError}</p>
          {selectedFiles.length > 0 && autoUpload && (
            <button
              type="button"
              onClick={() => {
                setLocalError(null);
                void uploadSelectedFiles(selectedFiles);
              }}
              disabled={isUploading}
              className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
            >
              {strings.retry}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
