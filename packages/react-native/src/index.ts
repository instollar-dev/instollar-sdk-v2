export { ThemeProvider, useTheme, useThemeColors, useResolvedScheme } from './theme/ThemeProvider';
export type { ThemeMode, ThemeProviderProps, InstollarTheme } from './theme/ThemeProvider';

export { Text } from './components/Text';
export type { TextProps, TextVariant } from './components/Text';

export { Button } from './components/Button';
export type {
  ButtonProps,
  ButtonVariant,
  ButtonTone,
  ButtonSize,
} from './components/Button';

export { Spinner } from './components/Spinner';
export type { SpinnerProps } from './components/Spinner';

export { ProgressBar } from './components/ProgressBar';
export type { ProgressBarProps, ProgressBarSize } from './components/ProgressBar';

export { Modal } from './components/Modal';
export type { ModalProps } from './components/Modal';

export { Sheet } from './components/Sheet';
export type { SheetProps } from './components/Sheet';

export { ToastProvider } from './toast/ToastProvider';
export type { ToastProviderProps } from './toast/ToastProvider';

export { FieldControl } from './components/FieldControl';
export type { FieldControlProps } from './components/FieldControl';

export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { PhoneInput } from './components/PhoneInput';
export type { PhoneInputProps } from './components/PhoneInput';

export { Textarea } from './components/Textarea';
export type { TextareaProps } from './components/Textarea';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

export { Radio, RadioGroup } from './components/Radio';
export type { RadioProps, RadioGroupProps } from './components/Radio';

export { Switch } from './components/Switch';
export type { SwitchProps } from './components/Switch';

export { Select, selectOptionsPropsFromQuery } from './components/Select';
export type { SelectProps, SelectOption, SelectVariant } from './components/Select';

export { OtpInput, VerificationInput } from './components/OtpInput';
export type { OtpInputProps, VerificationInputProps } from './components/OtpInput';

export { Alert } from './components/Alert';
export type { AlertProps, AlertVariant } from './components/Alert';

export { AlertText, dismissibleAlertProps } from './components/AlertText';
export type {
  AlertTextProps,
  AlertTextVariant,
  DismissibleAlertProps,
} from './components/AlertText';

export {
  Icon,
  Home2,
  ArrowLeft2,
  ArrowRight2,
  ArrowDown2,
  ArrowUp2,
  ArrowCircleLeft2,
  ArrowCircleRight2,
  User,
  UserAdd,
  Profile2User,
  People,
  Login,
  Logout,
  Lock,
  Unlock,
  Eye,
  EyeSlash,
  ShieldTick,
  SecuritySafe,
  Add,
  AddCircle,
  Minus,
  CloseCircle,
  TickCircle,
  TickSquare,
  Trash,
  Edit2,
  Copy,
  DocumentDownload,
  DocumentUpload,
  Send2,
  Refresh,
  SearchNormal1,
  Filter,
  More,
  More2,
  InfoCircle,
  Warning2,
  Danger,
  Notification,
  NotificationBing,
  Calendar,
  Clock,
  Location,
  Gps,
  Gallery,
  Image,
  DocumentText,
  Folder2,
  Bag2,
  Box1,
  Briefcase,
  Chart,
  Chart21,
  Setting2,
  Setting4,
  Category,
  Element3,
  TextalignLeft,
  Menu,
  Sun,
  Sun1,
  Moon,
} from './components/Icon';
export type { IconProps, IconSize, IconColor } from './components/Icon';

export { Card } from './components/Card';
export type { CardProps, CardVariant } from './components/Card';

export { Avatar, getAvatarInitials } from './components/Avatar';
export type { AvatarProps, AvatarSize } from './components/Avatar';

export { Chip } from './components/Chip';
export type { ChipProps } from './components/Chip';

export { Tabs } from './components/Tabs';
export type {
  TabsProps,
  TabModel,
  TabV2Model,
  TabsRouterAdapter,
} from './components/Tabs';

export { Segments } from './components/Segments';
export type {
  SegmentsProps,
  SegmentOption,
  SegmentsRouterAdapter,
} from './components/Segments';

export { StatusBadge, createStatusResolver } from './components/StatusBadge';
export type {
  StatusBadgeProps,
  StatusTone,
  StatusVariant,
  StatusBadgeSize,
  StatusIcon,
  StatusRule,
  StatusResolverConfig,
  ResolvedStatus,
} from './components/StatusBadge';

export { LoadBoundary, loadBoundaryPropsFromQuery } from './components/LoadBoundary';
export type { LoadBoundaryProps } from './components/LoadBoundary';

export { SettingsItem } from './components/SettingsItem';
export type { SettingsItemProps } from './components/SettingsItem';

export { Accordion, AccordionItem, useAccordion } from './components/Accordion';
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionType,
  UseAccordionOptions,
} from './components/Accordion';

export {
  SuccessPanel,
  SuccessModalIcon,
  DEFAULT_SUCCESS_TITLE,
  DEFAULT_SUCCESS_DESCRIPTION,
  DEFAULT_SUCCESS_BUTTON_LABEL,
} from './components/SuccessPanel';
export type { SuccessPanelProps } from './components/SuccessPanel';

export { SuccessModal } from './components/SuccessModal';
export type { SuccessModalProps } from './components/SuccessModal';

export { FileUpload } from './components/FileUpload';
export type {
  FileUploadProps,
  FileUploadStrings,
  UploadedFileAsset,
} from './components/FileUpload.types';
export {
  ALL_DOCUMENT_UPLOAD_ACCEPT,
  registerFilePickerModules,
  getDocumentPickerModule,
  getImagePickerModule,
} from './components/FileUpload';
export type { PickedFile } from './utils/filePickerModules';

export {
  sanitizeNumberInput,
  formatNumberInput,
  numberInputDisplayValue,
  numberInputRawValue,
} from './utils/numberInputUtils';

export type { PhoneValue, PhoneParts, PhoneCountryOption } from '@instollar-dev/instollar-core/utils/phone';
export {
  formatPhoneForApi,
  normalizePhoneForApi,
  formatPhoneValueForApi,
  toE164,
  digitsOnly,
  formatNationalNumber,
  validateNationalNumber,
  toPhoneCountryOptions,
  createPhoneValue,
  countryCodeToFlagEmoji,
} from '@instollar-dev/instollar-core/utils/phone';

export {
  COUNTRIES,
  getCountryByCode,
  searchCountries,
} from '@instollar-dev/instollar-core/countries';
export type { Country } from '@instollar-dev/instollar-core/countries';

export {
  triggerHapticFeedback,
  setHapticsEnabled,
  getHapticsEnabled,
  registerHapticsModule,
  withHapticPress,
} from './utils/haptics';
export type { HapticFeedbackType } from './utils/haptics';

/** Re-export core APIs so RN apps can use one UI package + core init. */
export {
  initInstollarSDK,
  toast,
  setToastHandler,
  clearToastHandler,
  api,
  authApi,
  adminApi,
  companyApi,
  installerApi,
  sharedApi,
  initStorage,
  initStorageAuto,
  createExpoSecureStorage,
  detectPlatform,
  isMobile,
  isWeb,
} from '@instollar-dev/instollar-core';
export type {
  InitInstollarSDKOptions,
  ToastOptions,
  ToastType,
  IStorage,
} from '@instollar-dev/instollar-core';
