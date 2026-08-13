import { normalizeDocumentUrlList } from '@instollar-dev/instollar-core';

import { FileUpload } from './FileUpload';
import type { FileUploadProps, FileUploadStrings } from './FileUpload.types';
import { AccordionItem } from './Accordion';

const DOCUMENT_UPLOAD_STRINGS: Partial<FileUploadStrings> = {
  clickToUpload: 'Tap to browse files',
  browse: 'Browse files',
  chooseSource: 'Add file',
};

const IMAGE_UPLOAD_STRINGS: Partial<FileUploadStrings> = {
  clickToUpload: 'Tap to take a photo or browse files',
  browse: 'Add photo',
  chooseSource: 'Add photo',
  takePhoto: 'Take photo',
  chooseFromLibrary: 'Photo library',
  chooseFile: 'Browse files',
};

export type AccordionFileUploadItemProps = {
  value: string;
  title: string;
  error?: string;
  disabled?: boolean;
  accept: string;
  /** Enables camera / photo-library copy in the upload sheet. */
  allowsImages?: boolean;
  showPreviewGrid?: boolean;
  fileUrls: string[];
  onFileUrlsChange: (urls: string[]) => void;
  /** Called after files are added successfully. */
  onFilesAdded?: (urls: string[]) => void;
  /** Called when an upload fails. */
  onUploadFailed?: (error: unknown) => void;
} & Pick<
  FileUploadProps,
  | 'uploadFn'
  | 'offlineSaveFn'
  | 'autoUpload'
  | 'allowOfflineSave'
  | 'isOnline'
  | 'maxSizeMB'
  | 'strings'
>;

export function AccordionFileUploadItem({
  value,
  title,
  error,
  disabled,
  accept,
  allowsImages = false,
  showPreviewGrid = false,
  fileUrls,
  onFileUrlsChange,
  onFilesAdded,
  onUploadFailed,
  uploadFn,
  offlineSaveFn,
  autoUpload = true,
  allowOfflineSave = Boolean(offlineSaveFn),
  isOnline = !offlineSaveFn,
  maxSizeMB,
  strings,
}: AccordionFileUploadItemProps) {
  const copy = {
    ...(allowsImages ? IMAGE_UPLOAD_STRINGS : DOCUMENT_UPLOAD_STRINGS),
    ...strings,
  };

  const safeFileUrls = normalizeDocumentUrlList(fileUrls);

  return (
    <AccordionItem value={value} title={title} error={error} disabled={disabled}>
      <FileUpload
        key={safeFileUrls.join('|')}
        accept={accept}
        multiple
        autoUpload={autoUpload}
        allowOfflineSave={allowOfflineSave}
        isOnline={isOnline}
        showAssetPreviewGrid={showPreviewGrid}
        maxSizeMB={maxSizeMB}
        value={safeFileUrls}
        uploadFn={uploadFn}
        offlineSaveFn={offlineSaveFn}
        onFileSelect={() => undefined}
        onUploadComplete={(assets) => {
          const next = [...safeFileUrls, ...assets.map((asset) => asset.fileUrl)];
          onFileUrlsChange(next);
          onFilesAdded?.(next);
        }}
        onUploadError={(uploadError) => {
          onUploadFailed?.(uploadError);
        }}
        onDeleteFile={() => onFileUrlsChange([])}
        onDeleteFileAtIndex={(index) => {
          onFileUrlsChange(safeFileUrls.filter((_, itemIndex) => itemIndex !== index));
        }}
        strings={copy}
      />
    </AccordionItem>
  );
}
