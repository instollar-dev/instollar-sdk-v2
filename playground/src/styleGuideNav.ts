export type TocItem = { id: string; label: string };

export type TocGroup = {
  title: string;
  description?: string;
  items: TocItem[];
};

export const styleGuideNav: TocGroup[] = [
  {
    title: 'Foundation',
    description: 'Install, tokens, and primitives',
    items: [
      { id: 'sg-setup', label: 'Setup' },
      { id: 'sg-theme', label: 'ThemeProvider' },
      { id: 'sg-colors', label: 'Colors' },
      { id: 'sg-text', label: 'Text' },
      { id: 'sg-icon', label: 'Icon' },
      { id: 'sg-spinner', label: 'Spinner' },
    ],
  },
  {
    title: 'Actions',
    description: 'Buttons, chips, and tab controls',
    items: [
      { id: 'sg-button', label: 'Button' },
      { id: 'sg-chip', label: 'Chip' },
      { id: 'sg-unified-tabs', label: 'Tabs' },
    ],
  },
  {
    title: 'Display',
    description: 'Status, alerts, and surfaces',
    items: [
      { id: 'sg-status', label: 'StatusBadge' },
      { id: 'sg-alert', label: 'Alert' },
      { id: 'sg-alert-text', label: 'AlertText' },
      { id: 'sg-card', label: 'Card' },
    ],
  },
  {
    title: 'Forms',
    description: 'Inputs and selection controls',
    items: [
      { id: 'sg-input', label: 'Input' },
      { id: 'sg-address-autocomplete', label: 'AddressAutocomplete' },
      { id: 'sg-date-input', label: 'DateInput' },
      { id: 'sg-otp-input', label: 'OtpInput' },
      { id: 'sg-textarea', label: 'Textarea' },
      { id: 'sg-checkbox', label: 'Checkbox' },
      { id: 'sg-radio', label: 'Radio' },
      { id: 'sg-switch', label: 'Switch' },
      { id: 'sg-select', label: 'Select' },
      { id: 'sg-dropdown-menu', label: 'DropdownMenu' },
    ],
  },
  {
    title: 'Data',
    description: 'Editable and display-oriented data',
    items: [{ id: 'sg-table', label: 'Table' }],
  },
  {
    title: 'Feedback',
    description: 'Overlays, loading, and permission states',
    items: [
      { id: 'sg-modal', label: 'ModalProvider / useModal' },
      { id: 'sg-drawer', label: 'DrawerProvider / useDrawer' },
      { id: 'sg-load', label: 'LoadBoundary' },
    ],
  },
];

export function flattenTocGroups(groups: TocGroup[]): TocItem[] {
  return groups.flatMap((group) => group.items);
}
