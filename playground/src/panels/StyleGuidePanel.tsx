import { useRef, useState, type ReactNode } from 'react';
import {
  Alert,
  AlertText,
  ArrowRight2,
  Button,
  Card,
  Checkbox,
  Chip,
  DrawerProvider,
  Home2,
  Icon,
  Input,
  LoadBoundary,
  Lock,
  ModalProvider,
  Radio,
  RadioGroup,
  SearchNormal1,
  Select,
  Spinner,
  StatusBadge,
  Switch,
  Table,
  Tabs,
  Text,
  Textarea,
  User,
  createStatusResolver,
  dismissibleAlertProps,
  useDrawer,
  useModal,
  type StatusVariant,
  type TableHandle,
} from '@codearemo/instollar-sdk';
import { brand, colors, fonts } from '@codearemo/instollar-tokens';
import {
  DemoFrame,
  PageHeader,
  PageTocLayout,
  PageTocOverview,
  Section,
  StatusMark,
  SubSection,
  TocGroupDivider,
} from '../ui';
import { styleGuideNav } from '../styleGuideNav';
import { styleGuideSnippets as snippets } from '../styleGuideSnippets';

const textVariants = [
  'spline-bold-display',
  'spline-bold-h4',
  'spline-bold-h5',
  'spline-bold-label',
  'spline-regular-p',
  'open-bold-h5',
  'open-bold-p',
  'open-regular-p',
  'open-regular-label',
  'open-regular-tiny',
] as const;

const iconSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const iconColors = ['current', 'primary', 'secondary', 'muted', 'inverse', 'destructive'] as const;
const iconStyles = ['Linear', 'Outline', 'Broken', 'Bold', 'Bulk', 'TwoTone'] as const;

const buttonVariants = ['primary', 'secondary', 'ghost', 'destructive', 'danger'] as const;
const alertVariants = ['success', 'error', 'destructive', 'warning', 'info'] as const;
const statusVariants: StatusVariant[] = [
  'success',
  'successTint',
  'info',
  'progress',
  'warning',
  'warningAmber',
  'danger',
  'dangerBordered',
  'dangerStrong',
  'dangerTint',
  'review',
  'muted',
  'neutral',
];
const fieldSurfaces = ['light', 'dark'] as const;

const colorSwatches = [
  { name: 'primary', value: colors.primary, className: 'bg-primary' },
  { name: 'secondary', value: colors.secondary, className: 'bg-secondary' },
  { name: 'background', value: colors.bg, className: 'bg-background border border-border' },
  { name: 'foreground', value: colors.fg, className: 'bg-foreground' },
  { name: 'destructive', value: colors.destructive, className: 'bg-destructive' },
  { name: 'muted', value: 'var(--color-muted)', className: 'bg-muted' },
] as const;

const { StatusBadge: ResolvedStatusBadge } = createStatusResolver({
  rules: [
    { matches: ['completed'], variant: 'success', icon: 'check' },
    { matches: ['pending_qa'], variant: 'warning', icon: 'clock', label: 'Pending QA' },
    { matches: ['in-progress'], variant: 'progress', icon: 'clock', label: 'In progress' },
    { matches: ['rejected'], variant: 'dangerStrong', icon: 'ban' },
  ],
});

function ModalDemo() {
  const { openModal, closeModal } = useModal();

  return (
    <Button
      onClick={() =>
        openModal({
          size: 'md',
          content: (
            <div className="flex flex-col gap-4">
              <Text variant="spline-bold-h5">Programmatic modal</Text>
              <Text variant="open-regular-p" className="text-muted">
                Opened with useModal. Backdrop and Escape dismissal are disabled by default.
              </Text>
              <Button className="w-fit" onClick={closeModal}>
                Close and continue
              </Button>
            </div>
          ),
        })
      }
    >
      Open modal
    </Button>
  );
}

function DrawerDemo() {
  const { openDrawer, closeDrawer } = useDrawer();

  return (
    <Button
      onClick={() =>
        openDrawer({
          title: 'Edit profile',
          closeOnBackdrop: true,
          content: (
            <div className="flex flex-col gap-4">
              <Text variant="open-regular-p" className="text-muted">
                Opened with useDrawer. Slides in from the right, stacks like modals, and keeps the
                same safe dismissal defaults — this one opts into closeOnBackdrop.
              </Text>
              <Input label="Full name" placeholder="Ada Lovelace" />
              <Textarea label="Bio" placeholder="Tell us about yourself" rows={3} />
            </div>
          ),
          footer: (
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={closeDrawer}>
                Cancel
              </Button>
              <Button onClick={closeDrawer}>Save changes</Button>
            </div>
          ),
        })
      }
    >
      Open drawer
    </Button>
  );
}

function VariantRow({
  label,
  hint,
  children,
  dark,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={
        dark
          ? 'flex flex-col gap-3 rounded-xl bg-primary px-4 py-4 text-white sm:flex-row sm:items-center'
          : 'flex flex-col gap-3 border-b border-border py-4 last:border-0 sm:flex-row sm:items-center'
      }
    >
      <div className="w-full shrink-0 sm:w-44">
        <code className={dark ? 'text-[12px] text-white/80' : 'text-[12px] text-muted'}>{label}</code>
        {hint ? (
          <p className={dark ? 'mt-0.5 text-open-regular-tiny text-white/55' : 'mt-0.5 text-open-regular-tiny text-muted'}>
            {hint}
          </p>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function StyleGuidePanel() {
  const [role, setRole] = useState('installer');
  const [skills, setSkills] = useState<string[]>(['wiring']);
  const [addNewHint, setAddNewHint] = useState(false);
  const [chipOn, setChipOn] = useState(true);
  const [switchOn, setSwitchOn] = useState(true);
  const [inlineError, setInlineError] = useState<string | null>('Email address is required.');
  const [loadMode, setLoadMode] = useState<'content' | 'loading' | 'error' | 'forbidden' | 'stale'>(
    'content',
  );
  const [activeTab, setActiveTab] = useState('overview');
  const [headerTab, setHeaderTab] = useState('Company');
  const [tableRows, setTableRows] = useState<Record<string, any>[]>([
    { id: 1, item: 'Solar panels', quantity: 12, category: 'hardware', status: 'Ready' },
    { id: 2, item: 'Installation', quantity: 1, category: 'service', status: 'Scheduled' },
  ]);
  const [tableResult, setTableResult] = useState('Use the buttons to inspect or validate the rows.');
  const tableRef = useRef<TableHandle>(null);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Chapter 02"
        title="Style guide"
        description="Every shipped component with every public variant. Browse by category — labels show the exact prop values."
        meta={<StatusMark status="shipped">Shipped</StatusMark>}
      />

      <PageTocOverview groups={styleGuideNav} className="hidden xl:flex" />

      <PageTocLayout groups={styleGuideNav} railTitle="Components">
        <div className="flex flex-col gap-12">

      <Section id="sg-setup" title="Setup" code={snippets.setup}>
        <p className="max-w-xl text-open-regular-p text-muted">
          Import styles once at app entry, then pull components from the SDK package.
        </p>
      </Section>

      <Section id="sg-colors" title="Colors" code={snippets.colors}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {colorSwatches.map((swatch) => (
            <div
              key={swatch.name}
              className="flex items-center gap-3 rounded-xl border border-border bg-white p-3"
            >
              <span className={`size-12 shrink-0 rounded-lg ${swatch.className}`} />
              <div className="min-w-0">
                <Text variant="open-bold-p">{swatch.name}</Text>
                <Text variant="open-regular-tiny" className="truncate text-muted">
                  {swatch.value}
                </Text>
              </div>
            </div>
          ))}
        </div>
        <p className="text-open-regular-tiny text-muted">
          brand {brand.primary} / {brand.secondary} · {fonts.spline.split(',')[0]}, Inter, Open Sans
        </p>
      </Section>

      {/* ——— Text ——— */}
      <Section id="sg-text" title="Text" description="variant" code={snippets.text}>
        <DemoFrame label="variant" className="!p-0">
          <div className="divide-y divide-border px-4">
            {textVariants.map((variant) => (
              <VariantRow key={variant} label={`variant="${variant}"`}>
                <Text variant={variant}>The quick brown fox</Text>
              </VariantRow>
            ))}
          </div>
        </DemoFrame>
      </Section>

      {/* ——— Icon ——— */}
      <Section id="sg-icon" title="Icon" description="size · color · variant (Iconsax style)" code={snippets.icon}>
        <DemoFrame label="size" className="!pb-2">
          <div className="flex flex-wrap items-end gap-6">
            {iconSizes.map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Icon icon={Home2} size={size} color="primary" />
                <code className="text-[11px] text-muted">{size}</code>
              </div>
            ))}
          </div>
        </DemoFrame>
        <DemoFrame label="color" className="!pb-2">
          <div className="flex flex-wrap items-end gap-5">
            {iconColors.map((color) => (
              <div
                key={color}
                className={
                  color === 'inverse' || color === 'secondary'
                    ? 'flex flex-col items-center gap-2 rounded-lg bg-primary px-3 py-2'
                    : 'flex flex-col items-center gap-2'
                }
              >
                <Icon icon={Home2} size="md" color={color} />
                <code
                  className={
                    color === 'inverse' || color === 'secondary'
                      ? 'text-[11px] text-white/70'
                      : 'text-[11px] text-muted'
                  }
                >
                  {color}
                </code>
              </div>
            ))}
          </div>
        </DemoFrame>
        <DemoFrame label='variant (Iconsax style)' className="!pb-2">
          <div className="flex flex-wrap items-end gap-5">
            {iconStyles.map((style) => (
              <div key={style} className="flex flex-col items-center gap-2">
                <Icon icon={Home2} size="lg" color="primary" variant={style} />
                <code className="text-[11px] text-muted">{style}</code>
              </div>
            ))}
          </div>
        </DemoFrame>
      </Section>

      {/* ——— Spinner ——— */}
      <Section id="sg-spinner" title="Spinner" description="size (px) · className for color" code={snippets.spinner}>
        <DemoFrame>
          <div className="flex flex-wrap items-end gap-8">
            {[16, 24, 32, 48].map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Spinner size={size} className="text-primary" />
                <code className="text-[11px] text-muted">size={size}</code>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2">
              <Spinner size={24} className="text-destructive" />
              <code className="text-[11px] text-muted">text-destructive</code>
            </div>
          </div>
        </DemoFrame>
      </Section>

      <TocGroupDivider title="Actions" description="Buttons, chips, and tab controls" />

      {/* ——— Button ——— */}
      <Section
        id="sg-button"
        title="Button"
        description="variant · tone (ghost) · size · loading · prefix / suffix · disabled"
        code={snippets.button}
      >
        <DemoFrame label="variant" className="!p-0">
          <div className="px-4">
            {buttonVariants.map((variant) => (
              <VariantRow key={variant} label={`variant="${variant}"`}>
                <Button variant={variant}>{variant}</Button>
              </VariantRow>
            ))}
          </div>
        </DemoFrame>
        <DemoFrame label="tone (ghost only)" className="!p-0">
          <div className="px-4">
            <VariantRow label='tone="default"'>
              <Button variant="ghost" tone="default">
                Ghost default
              </Button>
            </VariantRow>
            <VariantRow label='tone="destructive"'>
              <Button variant="ghost" tone="destructive">
                Ghost destructive
              </Button>
            </VariantRow>
            <VariantRow label='tone="danger"'>
              <Button variant="ghost" tone="danger">
                Ghost danger
              </Button>
            </VariantRow>
          </div>
        </DemoFrame>
        <DemoFrame label="size · loading · affixes · disabled" className="!p-0">
          <div className="px-4">
            <VariantRow label='size="default"'>
              <Button size="default">Default</Button>
            </VariantRow>
            <VariantRow label='size="sm"'>
              <Button size="sm">Small</Button>
            </VariantRow>
            <VariantRow label="loading">
              <Button loading>Saving…</Button>
            </VariantRow>
            <VariantRow label="prefix + suffix">
              <Button
                prefix={<Icon icon={Home2} size="sm" />}
                suffix={<Icon icon={ArrowRight2} size="sm" />}
              >
                Continue
              </Button>
            </VariantRow>
            <VariantRow label="disabled">
              <Button disabled>Disabled</Button>
            </VariantRow>
          </div>
        </DemoFrame>
      </Section>

      <TocGroupDivider title="Display" description="Status, alerts, and surfaces" />

      {/* ——— StatusBadge ——— */}
      <Section
        id="sg-status"
        title="StatusBadge"
        description="variant · status resolver · icon · size"
        code={snippets.statusBadge}
      >
        <DemoFrame label="variant" className="!p-0">
          <div className="px-4">
            {statusVariants.map((variant) => (
              <VariantRow key={variant} label={`variant="${variant}"`}>
                <StatusBadge variant={variant} label={variant} />
              </VariantRow>
            ))}
          </div>
        </DemoFrame>
        <DemoFrame label="createStatusResolver" className="!p-0">
          <div className="px-4">
            <VariantRow label='status="completed"'>
              <ResolvedStatusBadge status="completed" />
            </VariantRow>
            <VariantRow
              label='status="pending qa"'
              hint='Also matches "pending-qa", "pending_qa", and "PENDING_QA".'
            >
              <ResolvedStatusBadge status="pending qa" />
            </VariantRow>
            <VariantRow label='status="unknown_status"'>
              <ResolvedStatusBadge status="unknown_status" />
            </VariantRow>
            <VariantRow label="overrides">
              <ResolvedStatusBadge status="rejected" label="Needs attention" icon={false} size="lg" />
            </VariantRow>
          </div>
        </DemoFrame>
      </Section>

      {/* ——— Chip ——— */}
      <Section id="sg-chip" title="Chip" description="selected · prefix / suffix · disabled" code={snippets.chip}>
        <DemoFrame className="!p-0">
          <div className="px-4">
            <VariantRow label="selected={false}">
              <Chip selected={false} onClick={() => undefined}>
                Idle
              </Chip>
            </VariantRow>
            <VariantRow label="selected={true}">
              <Chip
                selected={chipOn}
                onClick={() => setChipOn((v) => !v)}
                prefix={<Icon icon={Home2} size="xs" />}
              >
                Selected (toggle)
              </Chip>
            </VariantRow>
            <VariantRow label="disabled">
              <Chip disabled>Disabled</Chip>
            </VariantRow>
          </div>
        </DemoFrame>
      </Section>

      {/* ——— Tabs ——— */}
      <Section
        id="sg-unified-tabs"
        title="Tabs"
        description="controlled or uncontrolled · header-only or content · overflow controls · router adapter"
        code={snippets.unifiedTabs}
      >
        <DemoFrame label="rich controlled tabs">
          <Tabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={[
              {
                value: 'overview',
                label: 'Overview',
                content: <Text variant="open-regular-p">Overview content is active.</Text>,
              },
              {
                value: 'activity',
                label: 'Activity',
                content: <Text variant="open-regular-p">Recent activity appears here.</Text>,
              },
              {
                value: 'settings',
                label: 'Settings',
                content: <Text variant="open-regular-p">Settings content is rendered lazily.</Text>,
              },
            ]}
          />
        </DemoFrame>
        <DemoFrame label='header-only string tabs · variant="yellow"'>
          <Tabs
            tabs={['Company', 'Team', 'Billing']}
            activeTab={headerTab}
            onTabChange={setHeaderTab}
            variant="yellow"
            fullWidth
          />
        </DemoFrame>
      </Section>

      {/* ——— Alert ——— */}
      <Section id="sg-alert" title="Alert" description="variant · appearance · title · onDismiss" code={snippets.alert}>
        <SubSection title='appearance="inline"'>
          <div className="flex flex-col gap-3">
            {alertVariants.map((variant) => (
              <Alert
                key={variant}
                variant={variant}
                appearance="inline"
                title={variant}
                onDismiss={() => undefined}
              >
                Inline {variant} alert body.
              </Alert>
            ))}
          </div>
        </SubSection>
        <SubSection title='appearance="toast"'>
          <div className="flex flex-col gap-3">
            {alertVariants.map((variant) => (
              <Alert
                key={`toast-${variant}`}
                variant={variant}
                appearance="toast"
                title={variant}
                onDismiss={() => undefined}
              >
                Toast {variant} alert body.
              </Alert>
            ))}
          </div>
        </SubSection>
      </Section>

      {/* ——— AlertText ——— */}
      <Section
        id="sg-alert-text"
        title="AlertText"
        description="compact inline strip · error, success, pending, and info · optional dismissal"
        code={snippets.alertText}
      >
        <DemoFrame label="variants" className="space-y-3">
          <AlertText variant="error">The form could not be submitted.</AlertText>
          <AlertText variant="success">Your changes were saved.</AlertText>
          <AlertText variant="pending">Verification is still pending.</AlertText>
          <AlertText variant="info">A code was sent to your email address.</AlertText>
        </DemoFrame>
        <DemoFrame label="parent-backed dismissal">
          <div className="flex flex-col items-start gap-3">
            <AlertText
              variant="error"
              className="w-full"
              {...dismissibleAlertProps(inlineError, () => setInlineError(null))}
            />
            {inlineError == null ? (
              <Button size="sm" variant="ghost" onClick={() => setInlineError('A new error appeared.')}>
                Show a new message
              </Button>
            ) : null}
          </div>
        </DemoFrame>
      </Section>

      {/* ——— Card ——— */}
      <Section id="sg-card" title="Card" description='variant="light" (only value today)' code={snippets.card}>
        <DemoFrame>
          <Card className="max-w-sm">
            <Text variant="spline-bold-h5">Invoice</Text>
            <Text variant="open-regular-p" className="mt-1 text-muted">
              variant=&quot;light&quot;
            </Text>
            <Button size="sm" className="mt-3 w-fit">
              Pay
            </Button>
          </Card>
        </DemoFrame>
      </Section>

      <TocGroupDivider title="Forms" description="Inputs and selection controls" />

      {/* ——— Input ——— */}
      <Section
        id="sg-input"
        title="Input"
        description="variant (FieldSurface) · type password/number · prefix · error · disabled"
        code={snippets.input}
      >
        <DemoFrame label='variant="light"' className="max-w-xl space-y-4">
          <Input label="Default" placeholder="you@example.com" />
          <Input label="With error" error="Required" placeholder="…" />
          <Input
            label="Prefix"
            placeholder="Search"
            prefix={<Icon icon={SearchNormal1} size="sm" color="muted" />}
          />
          <Input label="Password" type="password" placeholder="••••••••" />
          <Input label="Number" type="number" placeholder="1,000" defaultValue="2500" />
          <Input label="Disabled" disabled placeholder="Unavailable" />
        </DemoFrame>
        <DemoFrame label='variant="dark"' className="max-w-xl space-y-4 !bg-primary">
          <Input variant="dark" label="Dark surface" placeholder="Search…" />
          <Input
            variant="dark"
            label="Dark + prefix"
            placeholder="Find"
            prefix={<Icon icon={User} size="sm" color="inverse" />}
          />
        </DemoFrame>
      </Section>

      {/* ——— Textarea ——— */}
      <Section id="sg-textarea" title="Textarea" description="variant · error · disabled" code={snippets.textarea}>
        {fieldSurfaces.map((surface) => (
          <DemoFrame
            key={surface}
            label={`variant="${surface}"`}
            className={surface === 'dark' ? 'max-w-xl !bg-primary' : 'max-w-xl'}
          >
            <div className="space-y-4">
              <Textarea variant={surface} label="Notes" placeholder="Optional" rows={3} />
              <Textarea
                variant={surface}
                label="With error"
                error="Too short"
                placeholder="…"
                rows={2}
              />
            </div>
          </DemoFrame>
        ))}
      </Section>

      {/* ——— Checkbox ——— */}
      <Section id="sg-checkbox" title="Checkbox" description="checked · description · error · variant · disabled" code={snippets.checkbox}>
        <DemoFrame className="!p-0">
          <div className="px-4">
            <VariantRow label="unchecked">
              <Checkbox label="Unchecked" />
            </VariantRow>
            <VariantRow label="checked">
              <Checkbox label="Checked" defaultChecked />
            </VariantRow>
            <VariantRow label="description">
              <Checkbox
                label="I agree"
                description="Required to continue"
                defaultChecked
              />
            </VariantRow>
            <VariantRow label="error">
              <Checkbox label="Must accept" error="Required" />
            </VariantRow>
            <VariantRow label="disabled">
              <Checkbox label="Disabled" disabled defaultChecked />
            </VariantRow>
            <VariantRow label='variant="dark"' dark>
              <Checkbox variant="dark" label="Dark surface" defaultChecked />
            </VariantRow>
          </div>
        </DemoFrame>
      </Section>

      {/* ——— Radio ——— */}
      <Section id="sg-radio" title="Radio / RadioGroup" description="value · description · variant · disabled" code={snippets.radio}>
        <DemoFrame label="default (light)">
          <RadioGroup label="Plan" defaultValue="pro" description="Pick a billing plan">
            <Radio value="starter" label="Starter" />
            <Radio value="pro" label="Pro" description="Most popular" />
            <Radio value="enterprise" label="Enterprise" disabled />
          </RadioGroup>
        </DemoFrame>
        <DemoFrame label='variant="dark"' className="!bg-primary">
          <RadioGroup variant="dark" label="Plan" defaultValue="pro">
            <Radio value="starter" label="Starter" />
            <Radio value="pro" label="Pro" description="Most popular" />
          </RadioGroup>
        </DemoFrame>
        <DemoFrame label="error">
          <RadioGroup label="Role" error="Pick one" defaultValue="">
            <Radio value="admin" label="Admin" />
            <Radio value="installer" label="Installer" />
          </RadioGroup>
        </DemoFrame>
      </Section>

      {/* ——— Switch ——— */}
      <Section id="sg-switch" title="Switch" description="checked · description · error · variant · disabled" code={snippets.switch}>
        <DemoFrame className="!p-0">
          <div className="px-4">
            <VariantRow label="off">
              <Switch label="Off" checked={false} onCheckedChange={() => undefined} />
            </VariantRow>
            <VariantRow label="on">
              <Switch
                label="On"
                description="Email digests"
                checked={switchOn}
                onCheckedChange={setSwitchOn}
              />
            </VariantRow>
            <VariantRow label="error">
              <Switch label="Required" error="Must enable" />
            </VariantRow>
            <VariantRow label="disabled">
              <Switch label="Disabled" disabled defaultChecked />
            </VariantRow>
            <VariantRow label='variant="dark"' dark>
              <Switch variant="dark" label="Dark surface" defaultChecked />
            </VariantRow>
          </div>
        </DemoFrame>
      </Section>

      {/* ——— Select ——— */}
      <Section
        id="sg-select"
        title="Select"
        description="single · multiple · searchable · creatable · add new · loading · error · variant"
        code={snippets.select}
      >
        <DemoFrame className="max-w-xl space-y-4">
          <Select
            label="Single"
            placeholder="Select a role"
            value={role}
            onValueChange={(v) => setRole(v as string)}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'installer', label: 'Installer' },
              { value: 'supervisor', label: 'Supervisor', disabled: true },
            ]}
          />
          <Select
            label="Searchable"
            searchable
            value={role}
            onValueChange={(v) => setRole(v as string)}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'installer', label: 'Installer' },
              { value: 'supervisor', label: 'Supervisor' },
            ]}
          />
          <Select
            label="Multiple + searchable + creatable"
            multiple
            searchable
            creatable
            value={skills}
            onValueChange={(v) => setSkills(v as string[])}
            options={[
              { value: 'wiring', label: 'Wiring' },
              { value: 'roofing', label: 'Roofing' },
              { value: 'inverters', label: 'Inverters' },
            ]}
          />
          <Select
            label="Add new action"
            searchable
            value={role}
            onValueChange={(v) => setRole(v as string)}
            onAddNew={() => setAddNewHint(true)}
            addNewLabel="Add new role…"
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'installer', label: 'Installer' },
              { value: 'supervisor', label: 'Supervisor' },
            ]}
          />
          {addNewHint && (
            <Alert variant="info" title="Add new flow">
              Wire <code className="text-xs">onAddNew</code> to open a modal, drawer, or route — the
              dropdown closes automatically.
            </Alert>
          )}
          <Select
            label="Options loading"
            options={[]}
            optionsLoading
            optionsLoadingLabel="Loading roles…"
            placeholder="…"
          />
          <Select
            label="Options error"
            options={[]}
            optionsError="Couldn't load options"
            onReloadOptions={() => undefined}
            reloadLabel="Retry"
            placeholder="…"
          />
          <Select
            label="Field error"
            error="Required"
            value=""
            onValueChange={() => undefined}
            options={[{ value: 'a', label: 'A' }]}
            placeholder="Choose…"
          />
          <Select
            label="Disabled"
            disabled
            value="installer"
            onValueChange={() => undefined}
            options={[{ value: 'installer', label: 'Installer' }]}
          />
          <Select
            label="With prefix"
            prefix={<Icon icon={Lock} size="sm" color="muted" />}
            value={role}
            onValueChange={(v) => setRole(v as string)}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'installer', label: 'Installer' },
            ]}
          />
        </DemoFrame>
        <DemoFrame label='variant="dark"' className="max-w-xl !bg-primary">
          <Select
            variant="dark"
            label="Dark surface"
            searchable
            value={role}
            onValueChange={(v) => setRole(v as string)}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'installer', label: 'Installer' },
            ]}
          />
        </DemoFrame>
      </Section>

      <TocGroupDivider title="Data" description="Editable and display-oriented data structures" />

      {/* ——— Table ——— */}
      <Section
        id="sg-table"
        title="Table"
        description="typed editable cells · controlled rows · validation · imperative ref · add and delete"
        code={snippets.table}
      >
        <DemoFrame label="editable line items" wide className="!p-0">
          <Table
            ref={tableRef}
            columns={[
              {
                key: 'item',
                label: 'Item',
                minWidth: '220px',
                validate: (value) => (String(value).trim() ? null : 'Item is required'),
              },
              {
                key: 'quantity',
                label: 'Quantity',
                type: 'number',
                width: '130px',
                align: 'center',
                validate: (value) => (value > 0 ? null : 'Use at least one'),
              },
              {
                key: 'category',
                label: 'Category',
                type: 'select',
                options: [
                  { label: 'Hardware', value: 'hardware' },
                  { label: 'Service', value: 'service' },
                ],
              },
              { key: 'status', label: 'Status', type: 'readonly' },
            ]}
            rows={tableRows}
            onRowsChange={setTableRows}
            showInlineDelete
            addRowText="Add line item"
            minWidth="780px"
          />
        </DemoFrame>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            onClick={() => {
              const result = tableRef.current?.validate();
              setTableResult(
                result?.isValid
                  ? 'All rows are valid.'
                  : `${result?.errors.length ?? 0} validation error(s).`,
              );
            }}
          >
            Validate
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setTableResult(JSON.stringify(tableRef.current?.getDataWithoutIds() ?? [], null, 2))
            }
          >
            Read data
          </Button>
          <pre className="max-w-full overflow-x-auto text-open-regular-tiny text-muted">
            {tableResult}
          </pre>
        </div>
      </Section>

      <TocGroupDivider title="Feedback" description="Loading and permission states" />

      {/* ——— ModalProvider / useModal ——— */}
      <Section
        id="sg-modal"
        title="ModalProvider / useModal"
        description="programmatic content · stacking · topmost close semantics · safe dismissal defaults"
        code={snippets.modal}
      >
        <DemoFrame>
          <ModalProvider>
            <ModalDemo />
          </ModalProvider>
        </DemoFrame>
      </Section>

      {/* ——— DrawerProvider / useDrawer ——— */}
      <Section
        id="sg-drawer"
        title="DrawerProvider / useDrawer"
        description="programmatic side panel · title / footer slots · stacking · slide-in animation"
        code={snippets.drawer}
      >
        <DemoFrame>
          <DrawerProvider>
            <DrawerDemo />
          </DrawerProvider>
        </DemoFrame>
      </Section>

      {/* ——— LoadBoundary ——— */}
      <Section
        id="sg-load"
        title="LoadBoundary"
        description="isLoading · isError · isStale · permitted · custom messages"
        code={snippets.loadBoundary}
      >
        <div className="mb-3 flex flex-wrap gap-2">
          {(['content', 'loading', 'error', 'forbidden', 'stale'] as const).map((mode) => (
            <Button
              key={mode}
              size="sm"
              variant={loadMode === mode ? 'primary' : 'ghost'}
              onClick={() => setLoadMode(mode)}
            >
              {mode}
            </Button>
          ))}
        </div>
        <DemoFrame label={`mode="${loadMode}"`}>
          <LoadBoundary
            isLoading={loadMode === 'loading'}
            isError={loadMode === 'error' || loadMode === 'stale'}
            isStale={loadMode === 'stale'}
            permitted={loadMode !== 'forbidden'}
            error={loadMode === 'error' || loadMode === 'stale' ? new Error('Request failed') : null}
            onRetry={() => setLoadMode('content')}
            minHeight={160}
            loadingMessage="Loading demo…"
            errorTitle="Something went wrong"
            forbiddenTitle="No access"
            forbiddenMessage="You do not have permission to view this."
            staleMessage="Showing last known data"
          >
            <Text variant="open-regular-p">Boundary children — success / stale content.</Text>
          </LoadBoundary>
        </DemoFrame>
      </Section>
        </div>
      </PageTocLayout>
    </div>
  );
}
