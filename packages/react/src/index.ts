export { Spinner } from './components/Spinner';
export type { SpinnerProps } from './components/Spinner';

export { ProgressBar } from './components/ProgressBar';
export type { ProgressBarProps, ProgressBarSize } from './components/ProgressBar';

export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonTone, ButtonSize } from './components/Button';

export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { PhoneInput } from './components/PhoneInput';
export type { PhoneInputProps } from './components/PhoneInput';
export type { PhoneValue } from '@instollar-dev/instollar-core/utils/phone';
export {
  formatPhoneValueForApi,
  toE164,
  validateNationalNumber,
  formatNationalNumber,
  createPhoneValue,
  countryCodeToFlagEmoji,
} from '@instollar-dev/instollar-core/utils/phone';

export { AddressAutocomplete, default } from './components/AddressAutocomplete';
export type { AddressAutocompleteProps } from './components/AddressAutocomplete';

export { FileUpload } from './components/FileUpload';
export { default as FileUploadDefault } from './components/FileUpload';
export type {
  FileUploadProps,
  FileUploadStrings,
  UploadedFileAsset,
} from './components/FileUpload.types';
export { ALL_DOCUMENT_UPLOAD_ACCEPT } from './components/fileUploadUtils';
export type { AddressComponents } from './places';
export {
  parseAddressComponents,
  fetchPlaceAutocompleteSuggestions,
  fetchPlaceDetailsAsAddress,
  configureGooglePlacesApiKey,
  getConfiguredGooglePlacesApiKey,
  resolveGooglePlacesApiKey,
} from './places';

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

export { StatusBadge, createStatusResolver } from './components/StatusBadge';
export type {
  StatusBadgeProps,
  StatusBadgeSize,
  StatusIcon,
  StatusResolverConfig,
  StatusRule,
  StatusTone,
  StatusVariant,
} from './components/StatusBadge';
export {
  statusBadgeBaseClasses,
  statusBadgeToneClasses,
} from './components/statusBadgeVariants';

export { FieldControl } from './components/FieldControl';
export type { FieldControlProps } from './components/FieldControl';

export {
  formControlSurfaceClass,
  formFieldLabelClass,
  formFieldErrorClass,
  formFieldDescriptionClass,
} from './components/formVariants';

export {
  sanitizeNumberInput,
  formatNumberInput,
  numberInputDisplayValue,
  numberInputRawValue,
} from './components/numberInputUtils';

export { Text } from './components/Text';
export type { TextProps, TextVariant } from './components/Text';

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


export { Alert } from './components/Alert';
export type { AlertProps, AlertVariant } from './components/Alert';

export { AlertText, dismissibleAlertProps } from './components/AlertText';
export type {
  AlertTextProps,
  DismissibleAlertProps,
  AlertVariant as AlertTextVariant,
} from './components/AlertText';

export {
  alertContainerClasses,
  toastContainerClasses,
  alertIconChipClasses,
  alertVariantClasses,
  toastVariantFromApi,
} from './components/alertVariants';

export { Card } from './components/Card';
export type { CardProps, CardVariant } from './components/Card';

export { SettingsItem } from './components/SettingsItem';
export type { SettingsItemProps } from './components/SettingsItem';
export { useSettingsAccordion } from './hooks/useSettingsAccordion';

export { Accordion, AccordionItem, useAccordion } from './components/Accordion';
export type {
  AccordionProps,
  AccordionItemProps,
  AccordionType,
  UseAccordionOptions,
} from './components/Accordion';

export { Avatar, getAvatarInitials } from './components/Avatar';
export type { AvatarProps, AvatarSize } from './components/Avatar';

export { Segments } from './components/Segments';
export type {
  SegmentsProps,
  SegmentOption,
  SegmentsRouterAdapter,
} from './components/Segments';

export { Chip } from './components/Chip';
export type { ChipProps } from './components/Chip';

export { LoadBoundary, loadBoundaryPropsFromQuery } from './components/LoadBoundary';
export type { LoadBoundaryProps } from './components/LoadBoundary';

export { Table } from './components/Table';
export type {
  CellType,
  ColumnDef,
  ColumnOption,
  TableHandle,
  TableLabels,
  TableProps,
} from './components/Table';

export { Tabs } from './components/Tabs';
export type {
  TabModel,
  TabV2Model,
  TabsProps,
  TabsRouterAdapter,
} from './components/Tabs';
export type { RouteSegmentAdapter } from './utils/routeSegmentMatch';

export { ModalProvider, useModal } from './components/ModalProvider';
export type { ModalConfig, ModalContextValue } from './components/ModalProvider';

export { SuccessModal } from './components/SuccessModal';
export type { SuccessModalProps } from './components/SuccessModal';
export { SuccessModalIcon } from './components/SuccessModalIcon';
export { useSuccessModal } from './hooks/useSuccessModal';
export type {
  OpenSuccessModalOptions,
  SuccessModalApi,
} from './hooks/useSuccessModal';

export { DrawerProvider, useDrawer } from './components/DrawerProvider';
export type { DrawerConfig, DrawerContextValue } from './components/DrawerProvider';

export { DropdownMenu } from './components/DropdownMenu';
export type { DropdownMenuItem, DropdownMenuProps } from './components/DropdownMenu';

export { DateInput, TimeInput, DateTimeInput } from './components/DateInput';
export type {
  DateInputProps,
  DateInputType,
  TimeInputProps,
  DateTimeInputProps,
} from './components/DateInput';

export { OtpInput, VerificationInput } from './components/OtpInput';
export type { OtpInputProps, VerificationInputProps } from './components/OtpInput';

export { useClickOutside } from './hooks/useClickOutside';
export { useOnClickOutside } from './hooks/useOnClickOutside';
export { useFloatingPosition } from './hooks/useFloatingPosition';
export type { FloatingPlacement, FloatingPosition } from './hooks/useFloatingPosition';
export { useMediaQuery } from './hooks/useMediaQuery';

export { ThemeProvider, useTheme } from './theme/ThemeProvider';
export type { Theme, ResolvedTheme, ThemeProviderProps } from './theme/ThemeProvider';

export { cn } from './utils/cn';
export { toSelectOptions } from './utils/toSelectOptions';
export type { NormalizedSelectOption } from './utils/toSelectOptions';
