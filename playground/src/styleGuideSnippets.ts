export const styleGuideSnippets = {
  setup: `import '@instollar-dev/instollar-react/styles.css';
import { ThemeProvider, Button, Text } from '@instollar-dev/instollar-sdk';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="system">
    <App />
  </ThemeProvider>,
);`,

  theme: `import { ThemeProvider, useTheme } from '@instollar-dev/instollar-sdk';

function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  return (
    <button type="button" onClick={toggleTheme}>
      {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}

// Persists preference · respects system · sets data-theme on <html>`,

  colors: `import { colors, darkColors, brand } from '@instollar-dev/instollar-tokens';
import { ThemeProvider, useTheme } from '@instollar-dev/instollar-sdk';

// Toggle: document.documentElement.dataset.theme = 'dark'
// Or wrap the app in <ThemeProvider> and call useTheme().

// CSS: bg-background · text-foreground · bg-brand · text-primary
// Destructive: bg-destructive · text-destructive
// Danger: bg-danger · text-danger`,

  text: `import { Text } from '@instollar-dev/instollar-sdk';

<Text variant="spline-bold-h4">Page title</Text>
<Text variant="open-regular-p" className="text-muted">
  Body copy
</Text>`,

  icon: `import { Icon, Home2 } from '@instollar-dev/instollar-sdk';

<Icon icon={Home2} size="md" color="primary" />
<Icon icon={Home2} size="lg" color="muted" variant="Bold" />`,

  spinner: `import { Spinner } from '@instollar-dev/instollar-sdk';

<Spinner size={24} className="text-primary" />
<Spinner size={32} className="text-destructive" />
<Spinner size={32} className="text-danger" />`,

  button: `import { Button, Icon, Home2, ArrowRight2 } from '@instollar-dev/instollar-sdk';

<Button variant="primary">Save</Button>
<Button variant="underline">Learn more</Button>
{/* Caution */}
<Button variant="destructive">Remove</Button>
<Button variant="ghost" tone="destructive">Cancel</Button>
{/* Critical */}
<Button variant="danger">Delete forever</Button>
<Button variant="ghost" tone="danger">Ban user</Button>
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
} from '@instollar-dev/instollar-sdk';

<StatusBadge variant="warning" label="Pending" icon="clock" />

const { StatusBadge: AppStatusBadge, resolve } = createStatusResolver({
  rules: [
    { matches: ['completed'], variant: 'success', icon: 'check' },
    { matches: ['pending_qa'], variant: 'warning', label: 'Pending QA' },
  ],
});

<AppStatusBadge status="pending qa" />`,

  chip: `import { Chip, Icon, Home2 } from '@instollar-dev/instollar-sdk';

<Chip selected={false} onClick={() => undefined}>Idle</Chip>
<Chip
  selected={selected}
  onClick={() => setSelected((v) => !v)}
  prefix={<Icon icon={Home2} size="xs" />}
>
  Filter
</Chip>`,

  segments: `import { Segments, Icon, Element3, TextalignLeft } from '@instollar-dev/instollar-sdk';
import { useLocation, useNavigate } from 'react-router-dom';

const [view, setView] = useState('table');

<Segments
  value={view}
  onChange={setView}
  options={[
    {
      value: 'pipeline',
      label: 'Pipeline',
      icon: <Icon icon={Element3} size="sm" />,
    },
    {
      value: 'table',
      label: 'Table',
      icon: <Icon icon={TextalignLeft} size="sm" />,
    },
  ]}
/>

// Router mode (same adapter shape as Tabs):
const location = useLocation();
const navigate = useNavigate();

<Segments
  useRoutes
  basePath="/leads"
  defaultValue="pipeline"
  router={{ pathname: location.pathname, navigate }}
  options={[
    { value: 'pipeline', label: 'Pipeline', path: 'pipeline', icon: <Icon icon={Element3} size="sm" /> },
    { value: 'table', label: 'Table', path: 'table', icon: <Icon icon={TextalignLeft} size="sm" /> },
  ]}
/>`,

  unifiedTabs: `import { Tabs } from '@instollar-dev/instollar-sdk';

// Active underline is #F49E0C by default; variant="green" uses #002816.
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

  alert: `import { Alert } from '@instollar-dev/instollar-sdk';

<Alert variant="success" appearance="inline" title="Saved" onDismiss={() => undefined}>
  Your changes were saved.
</Alert>

<Alert variant="error" appearance="toast" title="Failed" onDismiss={() => undefined}>
  Something went wrong.
</Alert>`,

  toast: `import { toast } from '@instollar-dev/instollar-sdk';

// error accents use --color-danger; warning uses --color-destructive
toast.success('Saved');
toast.error('Something went wrong', { title: 'Error' });
toast.warning('Review before publish');
toast.show({ type: 'info', title: 'Update', description: '…', position: 'bottom-right' });`,

  alertText: `import {
  AlertText,
  dismissibleAlertProps,
} from '@instollar-dev/instollar-sdk';

<AlertText variant="error">Email is required.</AlertText>
<AlertText variant="success">Changes saved.</AlertText>

<AlertText
  variant="error"
  className="w-full"
  {...dismissibleAlertProps(apiError, () => setApiError(null))}
/>`,

  card: `import { Card, Text, Button } from '@instollar-dev/instollar-sdk';

<Card className="max-w-sm">
  <Text variant="spline-bold-h5">Invoice</Text>
  <Text variant="open-regular-p" className="mt-1 text-muted">
    Due today
  </Text>
  <Button size="sm" className="mt-3 w-fit">Pay</Button>
</Card>`,

  avatar: `import { Avatar } from '@instollar-dev/instollar-sdk';

<Avatar src={user.avatarUrl} initials="Sarah Adams" />
<Avatar src={null} initials="SA" size="lg" onClick={() => openProfile()} />
<Avatar src="" initials="JD" size="sm" />`,

  settingsItem: `import {
  SettingsItem,
  useSettingsAccordion,
  Icon,
  SecuritySafe,
  Switch,
} from '@instollar-dev/instollar-sdk';

const { openSection, isSectionOpen, toggleSection } = useSettingsAccordion();

// Stable English keys — not translated titles
<div className="flex flex-col gap-4">
  <SettingsItem
    icon={<Icon icon={SecuritySafe} size="lg" color="primary" />}
    title={t('settings.sections.account.title')}
    description={t('settings.sections.account.desc')}
    isOpen={isSectionOpen('Account & Security')}
    onClick={() => toggleSection('Account & Security')}
  >
    <Switch label="Two-factor authentication" checked={twoFa} onCheckedChange={setTwoFa} />
  </SettingsItem>
</div>`,

  layout: `import { SharedScaffold, SidebarShell, DashboardHeader } from '@instollar-dev/instollar-sdk';

<SharedScaffold
  sidebar={
    <SidebarShell
      logo={<div className="font-bold">Logo</div>}
      nav={<nav>Links</nav>}
      footer={<div>Footer</div>}
    />
  }
  header={
    <DashboardHeader
      title="Dashboard"
      rightElement={<button>Profile</button>}
    />
  }
>
  <div className="p-5">Page content goes here</div>
</SharedScaffold>`,

  input: `import { Input, Icon, SearchNormal1 } from '@instollar-dev/instollar-sdk';

<Input label="Email" placeholder="you@example.com" />
<Input label="Search" prefix={<Icon icon={SearchNormal1} size="sm" color="muted" />} />
<Input label="Password" type="password" error="Required" />`,

  addressAutocomplete: `import {
  AddressAutocomplete,
  type AddressComponents,
} from '@instollar-dev/instollar-sdk';

const [query, setQuery] = useState('');

<AddressAutocomplete
  label="Address"
  apiKey={googlePlacesApiKey}
  inputValue={query}
  onInputChange={setQuery}
  onPlaceSelect={(address: AddressComponents) => console.log(address)}
/>`,

  textarea: `import { Textarea } from '@instollar-dev/instollar-sdk';

<Textarea label="Notes" placeholder="Optional" rows={3} />
<Textarea label="Notes" error="Too short" rows={2} />`,

  checkbox: `import { Checkbox } from '@instollar-dev/instollar-sdk';

<Checkbox label="I agree" description="Required to continue" />
<Checkbox label="Must accept" error="Required" defaultChecked />`,

  radio: `import { Radio, RadioGroup } from '@instollar-dev/instollar-sdk';

<RadioGroup label="Plan" defaultValue="pro" description="Pick a billing plan">
  <Radio value="starter" label="Starter" />
  <Radio value="pro" label="Pro" description="Most popular" />
  <Radio value="enterprise" label="Enterprise" disabled />
</RadioGroup>`,

  switch: `import { Switch } from '@instollar-dev/instollar-sdk';

<Switch
  label="Email digests"
  description="Weekly summary"
  checked={enabled}
  onCheckedChange={setEnabled}
/>
<Switch label="Required" error="Must enable" />`,

  select: `import { Select } from '@instollar-dev/instollar-sdk';

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

  dateInput: `import { DateInput, TimeInput, DateTimeInput } from '@instollar-dev/instollar-sdk';

<DateInput
  label="Interview date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
/>
<TimeInput label="Start time" value={time} onChange={(e) => setTime(e.target.value)} />
<DateTimeInput
  label="Scheduled at"
  value={when}
  onChange={(e) => setWhen(e.target.value)}
/>
<DateInput variant="inline" value={date} onChange={(e) => setDate(e.target.value)} />`,

  otpInput: `import { OtpInput, VerificationInput } from '@instollar-dev/instollar-sdk';

<OtpInput
  onChange={setCode}
  onResend={() => resendMutation.mutate()}
  resendLoading={resendMutation.isPending}
/>

{/* Alias — same component */}
<VerificationInput showResend={false} mask={false} />`,

  fileUpload: `import {
  FileUpload,
  ALL_DOCUMENT_UPLOAD_ACCEPT,
  type UploadedFileAsset,
} from '@instollar-dev/instollar-sdk';

// FileUpload Props Explained:
// - variant: "default" (large block) or "input" (compact single-line).
// - autoUpload: Defaults to true. Automatically uploads the file after selection.
// - uploadFn: Optional. Override the default upload logic.
// - allowOfflineSave: Set to true to cache files in IndexedDB when offline.
// - onUploadComplete: Fires when auto-upload finishes successfully.
<FileUpload
  label="ID document"
  accept={ALL_DOCUMENT_UPLOAD_ACCEPT}
  autoUpload
  uploadFn={async (formData, { applyWatermark }) => {
    const res = await uploadFiles(formData, { applyWatermark });
    return res.data ?? [];
  }}
  offlineSaveFn={saveFilesToIndexedDB}
  allowOfflineSave
  isOnline={isOnline}
  onUploadComplete={(assets) => setValue(assets[0]?.fileUrl)}
/>`,

  dropdownMenu: `import { DropdownMenu } from '@instollar-dev/instollar-sdk';

<DropdownMenu
  items={[
    { label: 'Edit', onClick: openEdit },
    { label: 'Delete', onClick: onDelete, className: 'text-danger' },
  ]}
/>

<DropdownMenu
  trigger={<button>Actions</button>}
  align="end"
  items={items}
  renderPermissionGate={(permission, children) => (
    <PermissionGuard permission={permission} mode="hide">
      {children}
    </PermissionGuard>
  )}
/>`,

  table: `import { useRef, useState } from 'react';
import { Table, type TableHandle } from '@instollar-dev/instollar-sdk';

const tableRef = useRef<TableHandle>(null);
const [rows, setRows] = useState(initialRows);
const [page, setPage] = useState(1);

// Editable + readonly (no focus outline on readonly/display/string)
<Table
  ref={tableRef}
  columns={[
    { key: 'item', label: 'Item', validate: (value) => value ? null : 'Required' },
    { key: 'quantity', label: 'Quantity', type: 'number' },
    { key: 'status', label: 'Status', type: 'readonly' },
  ]}
  rows={rows}
  onRowsChange={setRows}
  showInlineDelete
/>

// Pagination — active page uses solid #F49E0C (caller slices rows)
<Table
  columns={displayColumns}
  rows={pageRows}
  editable={false}
  paginated
  currentPage={page}
  totalPages={3}
  onPageChange={setPage}
/>`,

  modal: `import {
  ModalProvider,
  useModal,
  useSuccessModal,
} from '@instollar-dev/instollar-sdk';

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

function AfterSave() {
  const { openSuccessModal } = useSuccessModal();
  openSuccessModal({
    title: 'Order Created Successfully!',
    description: 'You have successfully created an order from this lead interest.',
    buttonLabel: 'View Order Details',
    onButtonClick: () => navigate('/orders/1'),
  });
}

<ModalProvider>
  <App />
</ModalProvider>`,

  drawer: `import {
  DrawerProvider,
  useDrawer,
} from '@instollar-dev/instollar-sdk';

function EditButton() {
  const { openDrawer, closeDrawer } = useDrawer();
  return (
    <button onClick={() => openDrawer({
      title: 'Edit profile',
      size: 'xl',            // sm | md | lg | xl | 2xl | full
      side: 'right',         // right | left
      closeOnBackdrop: true, // default false
      content: <EditForm />,
      footer: <SaveBar onDone={closeDrawer} />,
    })}>
      Edit
    </button>
  );
}

<DrawerProvider>
  <App />
</DrawerProvider>`,

  loadBoundary: `import { LoadBoundary, Text } from '@instollar-dev/instollar-sdk';

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
