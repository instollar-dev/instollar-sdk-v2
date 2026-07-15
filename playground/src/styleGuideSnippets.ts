export const styleGuideSnippets = {
  setup: `import '@codearemo/instollar-react/styles.css';
import { Button, Text } from '@codearemo/instollar-sdk';`,

  colors: `import { colors, brand, fonts } from '@codearemo/instollar-tokens';

// CSS variables are also available via styles.css:
// bg-primary · text-muted · border-border · etc.`,

  text: `import { Text } from '@codearemo/instollar-sdk';

<Text variant="spline-bold-h4">Page title</Text>
<Text variant="open-regular-p" className="text-muted">
  Body copy
</Text>`,

  icon: `import { Icon, Home2 } from '@codearemo/instollar-sdk';

<Icon icon={Home2} size="md" color="primary" />
<Icon icon={Home2} size="lg" color="muted" variant="Bold" />`,

  spinner: `import { Spinner } from '@codearemo/instollar-sdk';

<Spinner size={24} className="text-primary" />
<Spinner size={32} className="text-destructive" />`,

  button: `import { Button, Icon, Home2, ArrowRight2 } from '@codearemo/instollar-sdk';

<Button variant="primary">Save</Button>
<Button variant="ghost" tone="destructive">Cancel</Button>
<Button size="sm" loading>Saving…</Button>
<Button
  prefix={<Icon icon={Home2} size="sm" />}
  suffix={<Icon icon={ArrowRight2} size="sm" />}
>
  Continue
</Button>`,

  statusBadge: `import {
  StatusBadge,
  createStatusResolver,
} from '@codearemo/instollar-sdk';

<StatusBadge variant="warning" label="Pending" icon="clock" />

const { StatusBadge: AppStatusBadge, resolve } = createStatusResolver({
  rules: [
    { matches: ['completed'], variant: 'success', icon: 'check' },
    { matches: ['pending_qa'], variant: 'warning', label: 'Pending QA' },
  ],
});

<AppStatusBadge status="pending qa" />`,

  chip: `import { Chip, Icon, Home2 } from '@codearemo/instollar-sdk';

<Chip selected={false} onClick={() => undefined}>Idle</Chip>
<Chip
  selected={selected}
  onClick={() => setSelected((v) => !v)}
  prefix={<Icon icon={Home2} size="xs" />}
>
  Filter
</Chip>`,

  unifiedTabs: `import { Tabs } from '@codearemo/instollar-sdk';

// Active underline is #002816 by default; variant="yellow" uses the accent.
<Tabs
  activeTab={activeTab}
  onTabChange={setActiveTab}
  tabs={[
    { value: 'overview', label: 'Overview', content: <Overview /> },
    { value: 'activity', label: 'Activity', content: () => <Activity /> },
  ]}
/>

// Header-only compatibility:
<Tabs tabs={['Company', 'Team']} activeTab={activeTab} onTabChange={setActiveTab} />`,

  alert: `import { Alert } from '@codearemo/instollar-sdk';

<Alert variant="success" appearance="inline" title="Saved" onDismiss={() => undefined}>
  Your changes were saved.
</Alert>

<Alert variant="error" appearance="toast" title="Failed" onDismiss={() => undefined}>
  Something went wrong.
</Alert>`,

  card: `import { Card, Text, Button } from '@codearemo/instollar-sdk';

<Card className="max-w-sm">
  <Text variant="spline-bold-h5">Invoice</Text>
  <Text variant="open-regular-p" className="mt-1 text-muted">
    Due today
  </Text>
  <Button size="sm" className="mt-3 w-fit">Pay</Button>
</Card>`,

  input: `import { Input, Icon, SearchNormal1, User } from '@codearemo/instollar-sdk';

<Input label="Email" placeholder="you@example.com" />
<Input label="Search" prefix={<Icon icon={SearchNormal1} size="sm" color="muted" />} />
<Input label="Password" type="password" error="Required" />

<Input variant="dark" label="Dark surface" placeholder="Search…" />`,

  textarea: `import { Textarea } from '@codearemo/instollar-sdk';

<Textarea label="Notes" placeholder="Optional" rows={3} />
<Textarea variant="dark" label="Notes" error="Too short" rows={2} />`,

  checkbox: `import { Checkbox } from '@codearemo/instollar-sdk';

<Checkbox label="I agree" description="Required to continue" />
<Checkbox label="Must accept" error="Required" defaultChecked />
<Checkbox variant="dark" label="Dark surface" defaultChecked />`,

  radio: `import { Radio, RadioGroup } from '@codearemo/instollar-sdk';

<RadioGroup label="Plan" defaultValue="pro" description="Pick a billing plan">
  <Radio value="starter" label="Starter" />
  <Radio value="pro" label="Pro" description="Most popular" />
  <Radio value="enterprise" label="Enterprise" disabled />
</RadioGroup>`,

  switch: `import { Switch } from '@codearemo/instollar-sdk';

<Switch
  label="Email digests"
  description="Weekly summary"
  checked={enabled}
  onCheckedChange={setEnabled}
/>
<Switch label="Required" error="Must enable" />`,

  select: `import { Select } from '@codearemo/instollar-sdk';

<Select
  label="Role"
  placeholder="Select a role"
  value={role}
  onValueChange={setRole}
  options={[
    { value: 'admin', label: 'Admin' },
    { value: 'installer', label: 'Installer' },
  ]}
/>

<Select
  label="Skills"
  multiple
  searchable
  creatable
  value={skills}
  onValueChange={setSkills}
  options={[{ value: 'wiring', label: 'Wiring' }]}
/>

<Select
  label="Role"
  searchable
  onAddNew={() => openCreateRoleModal()}
  addNewLabel="Add new role…"
  value={role}
  onValueChange={setRole}
  options={roles}
/>`,

  table: `import { useRef, useState } from 'react';
import { Table, type TableHandle } from '@codearemo/instollar-sdk';

const tableRef = useRef<TableHandle>(null);
const [rows, setRows] = useState(initialRows);

<Table
  ref={tableRef}
  columns={[
    { key: 'item', label: 'Item', validate: (value) => value ? null : 'Required' },
    { key: 'quantity', label: 'Quantity', type: 'number' },
    { key: 'category', label: 'Category', type: 'select', options: categories },
  ]}
  rows={rows}
  onRowsChange={setRows}
  showInlineDelete
/>

const result = tableRef.current?.validate();
const data = tableRef.current?.getDataWithoutIds();`,

  modal: `import {
  ModalProvider,
  useModal,
} from '@codearemo/instollar-sdk';

function CreateButton() {
  const { openModal, closeModal } = useModal();
  return (
    <button onClick={() => openModal({
      size: 'md',
      content: <CreateForm onDone={closeModal} />,
    })}>
      Create
    </button>
  );
}

<ModalProvider>
  <App />
</ModalProvider>`,

  loadBoundary: `import { LoadBoundary, Text } from '@codearemo/instollar-sdk';

<LoadBoundary
  isLoading={query.isPending}
  isError={query.isError}
  isStale={query.isStale}
  permitted={canView}
  error={query.error}
  onRetry={() => query.refetch()}
  minHeight={160}
  loadingMessage="Loading jobs…"
  errorTitle="Something went wrong"
  forbiddenTitle="No access"
>
  <Text variant="open-regular-p">{query.data?.title}</Text>
</LoadBoundary>`,
} as const;
