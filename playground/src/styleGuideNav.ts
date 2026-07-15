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
      { id: 'sg-tabs', label: 'SegmentedTabs' },
    ],
  },
  {
    title: 'Display',
    description: 'Badges, alerts, and surfaces',
    items: [
      { id: 'sg-badge', label: 'Badge' },
      { id: 'sg-status', label: 'StatusBadge' },
      { id: 'sg-alert', label: 'Alert' },
      { id: 'sg-card', label: 'Card' },
    ],
  },
  {
    title: 'Forms',
    description: 'Inputs and selection controls',
    items: [
      { id: 'sg-input', label: 'Input' },
      { id: 'sg-textarea', label: 'Textarea' },
      { id: 'sg-checkbox', label: 'Checkbox' },
      { id: 'sg-radio', label: 'Radio' },
      { id: 'sg-switch', label: 'Switch' },
      { id: 'sg-select', label: 'Select' },
    ],
  },
  {
    title: 'Feedback',
    description: 'Loading and permission states',
    items: [{ id: 'sg-load', label: 'LoadBoundary' }],
  },
];

export function flattenTocGroups(groups: TocGroup[]): TocItem[] {
  return groups.flatMap((group) => group.items);
}
