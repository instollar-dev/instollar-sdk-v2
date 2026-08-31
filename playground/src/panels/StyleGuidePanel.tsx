import { useRef, useState, type ReactNode } from 'react';
import {
  AddressAutocomplete,
  Alert,
  AlertText,
  ArrowRight2,
  Avatar,
  Button,
  Card,
  Checkbox,
  Chip,
  DateInput,
  DateTimeInput,
  DocumentText,
  DrawerProvider,
  DropdownMenu,
  Element3,
  FileUpload,
  Home2,
  Icon,
  Input,
  LoadBoundary,
  Lock,
  ModalProvider,
  OtpInput,
  Radio,
  RadioGroup,
  NotificationBing,
  SearchNormal1,
  SecuritySafe,
  Segments,
  Select,
  Setting2,
  SettingsItem,
  Spinner,
  StatusBadge,
  Switch,
  Table,
  Tabs,
  Text,
  OverviewCard,
  ProductCard,
  ProductDetailsLayout,
  TextalignLeft,
  Textarea,
  TimeInput,
  VerificationInput,
  createStatusResolver,
  dismissibleAlertProps,
  toast,
  useDrawer,
  useModal,
  useSettingsAccordion,
  useSuccessModal,
  useTheme,
  Moon,
  Sun1,
  SharedScaffold,
  SidebarShell,
  DashboardHeader,
  type StatusVariant,
  type TableHandle,
  type AddressComponents,
} from '@instollar-dev/instollar-sdk';
import { brand, colors, darkColors, fonts } from '@instollar-dev/instollar-tokens';
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
const iconColors = ['current', 'brand', 'primary', 'secondary', 'muted', 'inverse', 'destructive', 'danger'] as const;
const iconStyles = ['Linear', 'Outline', 'Broken', 'Bold', 'Bulk', 'TwoTone'] as const;

const playgroundGooglePlacesApiKey =
  import.meta.env.VITE_GOOGLE_PLACES_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY || '';

const buttonVariants = [
  'primary',
  'secondary',
  'ghost',
  'underline',
  'destructive',
  'danger',
] as const;
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

const colorSwatches = [
  { name: 'brand', value: colors.brand, className: 'bg-brand' },
  { name: 'primary', value: colors.primary, className: 'bg-primary' },
  { name: 'secondary', value: colors.secondary, className: 'bg-secondary' },
  { name: 'background', value: colors.bg, className: 'bg-background border border-border' },
  { name: 'foreground', value: colors.fg, className: 'bg-foreground' },
  { name: 'destructive', value: colors.destructive, className: 'bg-destructive' },
  { name: 'danger', value: colors.danger, className: 'bg-danger' },
  { name: 'muted', value: 'var(--color-muted)', className: 'bg-muted' },
] as const;

const darkColorSwatches = [
  { name: 'brand', value: darkColors.brand, className: 'bg-brand' },
  { name: 'primary', value: darkColors.primary, className: 'bg-primary' },
  { name: 'secondary', value: darkColors.secondary, className: 'bg-secondary' },
  { name: 'background', value: darkColors.bg, className: 'bg-background border border-border' },
  { name: 'foreground', value: darkColors.fg, className: 'bg-foreground' },
  { name: 'destructive', value: darkColors.destructive, className: 'bg-destructive' },
  { name: 'danger', value: darkColors.danger, className: 'bg-danger' },
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
  const { openSuccessModal } = useSuccessModal();

  return (
    <div className="flex flex-wrap gap-2">
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
      <Button
        variant="secondary"
        onClick={() =>
          openSuccessModal({
            title: 'Order Created Successfully!',
            description: 'You have successfully created an order from this lead interest.',
            buttonLabel: 'View Order Details',
          })
        }
      >
        Open success modal
      </Button>
    </div>
  );
}

function StyleGuideThemeDemo() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={toggleTheme}>
          <Icon icon={isDark ? Sun1 : Moon} size="sm" color="primary" />
          Toggle ({resolvedTheme})
        </Button>
        {(['light', 'dark', 'system'] as const).map((value) => (
          <Button
            key={value}
            size="sm"
            variant={theme === value ? 'primary' : 'ghost'}
            onClick={() => setTheme(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <Text variant="open-regular-tiny" className="text-muted">
        Sets <code>data-theme</code> on <code>&lt;html&gt;</code> and persists the user preference.
        The playground shell uses the same <code>ThemeProvider</code> as your app should.
      </Text>
    </div>
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
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-0 sm:flex-row sm:items-center">
      <div className="w-full shrink-0 sm:w-44">
        <code className="text-[12px] text-muted">{label}</code>
        {hint ? <p className="mt-0.5 text-open-regular-tiny text-muted">{hint}</p> : null}
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
  const [viewSegment, setViewSegment] = useState('table');
  const [switchOn, setSwitchOn] = useState(true);
  const [inlineError, setInlineError] = useState<string | null>('Email address is required.');
  const [interviewDate, setInterviewDate] = useState('2025-08-22');
  const [addressQuery, setAddressQuery] = useState('');
  const [selectedAddress, setSelectedAddress] = useState<AddressComponents | null>(null);
  const [scheduledAt, setScheduledAt] = useState('2025-08-22T14:30');
  const [otpCode, setOtpCode] = useState('');
  const [loadMode, setLoadMode] = useState<'content' | 'loading' | 'error' | 'forbidden' | 'stale'>(
    'content',
  );
  const [activeTab, setActiveTab] = useState('overview');
  const [headerTab, setHeaderTab] = useState('Company');
  const [tableRows, setTableRows] = useState<Record<string, any>[]>([
    { id: 1, item: 'Solar panels', quantity: 12, category: 'hardware', status: 'Ready' },
    { id: 2, item: 'Installation', quantity: 1, category: 'service', status: 'Scheduled' },
  ]);
  const [tablePage, setTablePage] = useState(1);
  const [tableRowsPerPage, setTableRowsPerPage] = useState(5);
  const displayTableRows = [
    { id: 1, project: 'Lagos HQ', owners: 3, status: 'Active' },
    { id: 2, project: 'Abuja Mini-grid', owners: 1, status: 'Pending' },
    { id: 3, project: 'Kano Depot', owners: 2, status: 'Active' },
  ];
  const [tableResult, setTableResult] = useState('Use the buttons to inspect or validate the rows.');
  const tableRef = useRef<TableHandle>(null);
  const settingsAccordion = useSettingsAccordion();
  const [settingsNotify, setSettingsNotify] = useState(true);
  const [settingsTwoFa, setSettingsTwoFa] = useState(false);

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
          Import styles once at app entry, wrap the tree in <code>ThemeProvider</code>, then pull
          components from the SDK package.
        </p>
      </Section>

      <Section
        id="sg-theme"
        title="ThemeProvider"
        description="light · dark · system · persisted preference"
        code={snippets.theme}
      >
        <DemoFrame label="useTheme()" className="max-w-xl">
          <StyleGuideThemeDemo />
        </DemoFrame>
      </Section>

      <Section id="sg-colors" title="Colors" code={snippets.colors}>
        <p className="mb-4 max-w-2xl text-open-regular-tiny text-muted">
          <code>destructive</code> (<code>#f49e0c</code>) for caution actions.{' '}
          <code>danger</code> (<code>#dc2626</code>) for critical / irreversible actions.
          Both shift in dark theme.
        </p>
        <SubSection title="Light">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {colorSwatches.map((swatch) => (
              <div
                key={swatch.name}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
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
        </SubSection>
        <SubSection title="Dark (data-theme=&quot;dark&quot;)">
          <p className="mb-3 max-w-xl text-open-regular-tiny text-muted">
            Brand stays forest green for solid fills. Primary lifts to mint for readable accents;
            secondary is amber in light and dark. Canvas, text, borders, destructive,
            and danger shift with the theme. Toggle from the sidebar.
          </p>
          <div className="dark grid gap-3 rounded-2xl border border-border bg-background p-4 sm:grid-cols-2 lg:grid-cols-3">
            {darkColorSwatches.map((swatch) => (
              <div
                key={swatch.name}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
              >
                <span className={`size-12 shrink-0 rounded-lg ${swatch.className}`} />
                <div className="min-w-0">
                  <Text variant="open-bold-p" className="text-foreground">
                    {swatch.name}
                  </Text>
                  <Text variant="open-regular-tiny" className="truncate text-muted">
                    {swatch.value}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </SubSection>
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
            <div className="flex flex-col items-center gap-2">
              <Spinner size={24} className="text-danger" />
              <code className="text-[11px] text-muted">text-danger</code>
            </div>
          </div>
        </DemoFrame>
      </Section>

      <TocGroupDivider title="Actions" description="Buttons, chips, and tab controls" />

      {/* ——— Button ——— */}
      <Section
        id="sg-button"
        title="Button"
        description="variant · tone (ghost / underline) · size · loading · prefix / suffix · disabled"
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
        <DemoFrame label="tone (ghost / underline)" className="!p-0">
          <div className="px-4">
            <VariantRow label='ghost · tone="default"'>
              <Button variant="ghost" tone="default">
                Ghost default
              </Button>
            </VariantRow>
            <VariantRow label='ghost · tone="destructive"'>
              <Button variant="ghost" tone="destructive">
                Ghost destructive
              </Button>
            </VariantRow>
            <VariantRow label='ghost · tone="danger"'>
              <Button variant="ghost" tone="danger">
                Ghost danger
              </Button>
            </VariantRow>
            <VariantRow label='underline · tone="default"'>
              <Button variant="underline" tone="default">
                Underline default
              </Button>
            </VariantRow>
            <VariantRow label='underline · tone="destructive"'>
              <Button variant="underline" tone="destructive">
                Underline destructive
              </Button>
            </VariantRow>
            <VariantRow label='underline · tone="danger"'>
              <Button variant="underline" tone="danger">
                Underline danger
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

      <Section
        id="sg-segments"
        title="Segments"
        description="pill track · icon + label · controlled or useRoutes · size sm/md"
        code={snippets.segments}
      >
        <DemoFrame label="Pipeline / Table">
          <Segments
            value={viewSegment}
            onChange={setViewSegment}
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
          <Text variant="open-regular-tiny" className="mt-3 text-muted">
            Selected: {viewSegment}
          </Text>
        </DemoFrame>
        <DemoFrame label="router mode (simulated)">
          <Segments
            useRoutes
            basePath="/demo/leads"
            defaultValue="pipeline"
            router={{
              pathname: `/demo/leads/${viewSegment}`,
              navigate: (path) => {
                const next = path.split('/').pop() || 'pipeline';
                setViewSegment(next);
              },
            }}
            onChange={setViewSegment}
            options={[
              {
                value: 'pipeline',
                label: 'Pipeline',
                path: 'pipeline',
                icon: <Icon icon={Element3} size="sm" />,
              },
              {
                value: 'table',
                label: 'Table',
                path: 'table',
                icon: <Icon icon={TextalignLeft} size="sm" />,
              },
            ]}
          />
          <Text variant="open-regular-tiny" className="mt-3 text-muted">
            Simulated path: /demo/leads/{viewSegment}
          </Text>
        </DemoFrame>
        <DemoFrame label="size" className="!pb-2">
          <div className="flex flex-wrap items-center gap-4">
            <Segments
              size="sm"
              defaultValue="a"
              options={[
                { value: 'a', label: 'Day' },
                { value: 'b', label: 'Week' },
                { value: 'c', label: 'Month' },
              ]}
            />
            <Segments
              size="md"
              defaultValue="a"
              options={[
                { value: 'a', label: 'Day' },
                { value: 'b', label: 'Week' },
                { value: 'c', label: 'Month' },
              ]}
            />
          </div>
        </DemoFrame>
      </Section>

      {/* ——— Tabs ——— */}
      <Section
        id="sg-unified-tabs"
        title="Tabs"
        description="default active underline #F49E0C · variant green · header-only or content · overflow"
        code={snippets.unifiedTabs}
      >
        <DemoFrame label="default (yellow / #F49E0C)">
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
        <DemoFrame label='opt-in variant="green" (#002816)'>
          <Tabs
            tabs={['Company', 'Team', 'Billing']}
            activeTab={headerTab}
            onTabChange={setHeaderTab}
            variant="green"
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
          <p className="mb-3 max-w-2xl text-open-regular-tiny text-muted">
            In-app toast <em>styling</em> for React trees. To fire real stacked toasts on{' '}
            <code>document.body</code>, use the imperative <code>toast.*</code> API — see{' '}
            <strong>Feedback → toast (live)</strong> below or Special logic → Toasts.
          </p>
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

      <Section
        id="sg-avatar"
        title="Avatar"
        description="src image · initials fallback · size · onClick · broken image falls back"
        code={snippets.avatar}
      >
        <DemoFrame label="with image" className="!p-0">
          <div className="px-4">
            <VariantRow label='src="…" · initials="SA"'>
              <Avatar
                src="https://i.pravatar.cc/80?u=instollar-sarah"
                initials="Sarah Adams"
                alt="Sarah Adams"
              />
            </VariantRow>
          </div>
        </DemoFrame>
        <DemoFrame label="initials fallback" className="!p-0">
          <div className="px-4">
            <VariantRow label="src={null}">
              <Avatar src={null} initials="Sarah Adams" />
            </VariantRow>
            <VariantRow label='src=""'>
              <Avatar src="" initials="JD" />
            </VariantRow>
            <VariantRow label="broken src → initials">
              <Avatar src="https://example.invalid/missing.png" initials="BO" />
            </VariantRow>
            <VariantRow label="onClick">
              <Avatar
                src={null}
                initials="SA"
                onClick={() => {
                  window.alert('Avatar clicked');
                }}
              />
            </VariantRow>
          </div>
        </DemoFrame>
        <DemoFrame label="size" className="!pb-2">
          <div className="flex flex-wrap items-end gap-6">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Avatar src={null} initials="SA" size={size} />
                <code className="text-[11px] text-muted">{size}</code>
              </div>
            ))}
          </div>
        </DemoFrame>
      </Section>

      <Section
        id="sg-settings-item"
        title="SettingsItem"
        description="settings accordion · single-open · body unmounts when closed · useSettingsAccordion"
        code={snippets.settingsItem}
      >
        <DemoFrame label="Settings page shell" className="max-w-2xl !p-0 overflow-hidden">
          <div className="border-b border-border bg-background px-5 py-4 md:px-6">
            <Text variant="spline-bold-h5">Settings</Text>
            <Text variant="open-regular-tiny" className="mt-1 text-muted">
              Open section:{' '}
              <span className="font-medium text-foreground">
                {settingsAccordion.openSection ?? 'none'}
              </span>
            </Text>
          </div>
          <div className="flex flex-col gap-4 p-4 md:p-6">
            <SettingsItem
              id="account"
              icon={<Icon icon={SecuritySafe} size="lg" color="primary" />}
              title="Account & Security"
              description="Password, 2FA, and session settings"
              isOpen={settingsAccordion.isSectionOpen('Account & Security')}
              onClick={() => settingsAccordion.toggleSection('Account & Security')}
            >
              <div className="flex flex-col gap-4">
                <Switch
                  label="Two-factor authentication"
                  description="Require a code at sign-in"
                  checked={settingsTwoFa}
                  onCheckedChange={setSettingsTwoFa}
                />
                <button
                  type="button"
                  className="group flex w-full items-center justify-between border-0 bg-transparent py-2.5 text-left"
                >
                  <span className="text-open-regular-p text-foreground transition-colors group-hover:text-primary">
                    Change password
                  </span>
                  <Icon icon={ArrowRight2} size="sm" color="muted" />
                </button>
              </div>
            </SettingsItem>

            <SettingsItem
              id="notifications"
              icon={<Icon icon={NotificationBing} size="lg" color="primary" />}
              title="Notifications & Preferences"
              description="Channels and quiet hours"
              isOpen={settingsAccordion.isSectionOpen('Notifications & Preferences')}
              onClick={() => settingsAccordion.toggleSection('Notifications & Preferences')}
            >
              <div className="flex flex-col gap-4">
                <Switch
                  label="Email digests"
                  checked={settingsNotify}
                  onCheckedChange={setSettingsNotify}
                />
                <Checkbox label="Push notifications" defaultChecked />
                <Checkbox label="SMS alerts" />
              </div>
            </SettingsItem>

            <SettingsItem
              id="locale"
              icon={<Icon icon={Setting2} size="lg" color="primary" />}
              title="Language, Time Zone & Currency"
              description="Display and regional preferences"
              isOpen={settingsAccordion.isSectionOpen('Language, Time Zone & Currency')}
              onClick={() => settingsAccordion.toggleSection('Language, Time Zone & Currency')}
            >
              <Select
                label="Language"
                value="en"
                onChange={() => undefined}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'fr', label: 'Français' },
                ]}
              />
            </SettingsItem>

            <SettingsItem
              id="legal"
              icon={<Icon icon={DocumentText} size="lg" color="primary" />}
              title="Legal & About"
              description="Policies and app version"
              isOpen={settingsAccordion.isSectionOpen('Legal & About')}
              onClick={() => settingsAccordion.toggleSection('Legal & About')}
            >
              <div className="flex flex-col gap-2">
                <a
                  href="#style/sg-settings-item"
                  className="text-open-regular-p text-primary hover:underline"
                >
                  Privacy Policy
                </a>
                <a
                  href="#style/sg-settings-item"
                  className="text-open-regular-p text-primary hover:underline"
                >
                  Terms of Service
                </a>
                <Text variant="open-regular-tiny" className="text-muted">
                  Section keys stay English; titles can be i18n strings.
                </Text>
              </div>
            </SettingsItem>
          </div>
        </DemoFrame>
      </Section>

      {/* ——— Layout ——— */}
      <Section
        id="sg-layout"
        title="Layout"
        description="SharedScaffold · SidebarShell · DashboardHeader"
        code={snippets.layout}
      >
        <DemoFrame label="Preview" className="!p-0 h-[400px] overflow-hidden rounded-xl border-border bg-background">
          <SharedScaffold
            sidebar={
              <SidebarShell
                logo={<Text variant="spline-bold-h5">Instollar</Text>}
                nav={
                  <div className="flex flex-col gap-2">
                    <button type="button" className="text-left px-3 py-2 bg-[var(--color-brand,#012b15)]/10 text-[var(--color-brand,#012b15)] rounded-lg text-open-regular-tiny font-medium">Dashboard</button>
                    <button type="button" className="text-left px-3 py-2 text-foreground/70 hover:bg-muted/10 rounded-lg text-open-regular-tiny font-medium">Jobs</button>
                  </div>
                }
                footer={<div className="p-3 text-muted text-[11px]">Settings</div>}
              />
            }
            header={
              <DashboardHeader
                title="Dashboard"
                rightElement={<Avatar initials="A" size="sm" />}
              />
            }
          >
            <div className="p-6">
              <Text variant="open-regular-p">Your page content goes here.</Text>
            </div>
          </SharedScaffold>
        </DemoFrame>
      </Section>

      <TocGroupDivider title="Forms" description="Inputs and selection controls" />

      {/* ——— Input ——— */}
      <Section
        id="sg-input"
        title="Input"
        description="type password/number · prefix · error · disabled"
        code={snippets.input}
      >
        <DemoFrame label="Preview" className="max-w-xl space-y-4">
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
      </Section>

      <Section
        id="sg-address-autocomplete"
        title="AddressAutocomplete"
        description="Places API (New) · controlled input · debounced autocomplete · place details · no Maps JS SDK"
        code={snippets.addressAutocomplete}
      >
        <DemoFrame label="Preview" className="max-w-xl space-y-3">
          <AddressAutocomplete
            label="Street address"
            placeholder="Start typing an address…"
            apiKey={playgroundGooglePlacesApiKey || undefined}
            inputValue={addressQuery}
            onInputChange={setAddressQuery}
            onPlaceSelect={setSelectedAddress}
            helperText={
              playgroundGooglePlacesApiKey
                ? 'Uses VITE_GOOGLE_PLACES_API_KEY or VITE_GOOGLE_API_KEY in the playground only.'
                : 'Set VITE_GOOGLE_PLACES_API_KEY (or VITE_GOOGLE_API_KEY) to try live suggestions.'
            }
          />
          {selectedAddress ? (
            <Text variant="open-regular-tiny" className="text-muted whitespace-pre-wrap">
              {JSON.stringify(selectedAddress, null, 2)}
            </Text>
          ) : null}
        </DemoFrame>
      </Section>

      {/* ——— DateInput ——— */}
      <Section
        id="sg-date-input"
        title="DateInput / TimeInput / DateTimeInput"
        description="native date · time · datetime-local · default or inline · Calendar/Clock affordance"
        code={snippets.dateInput}
      >
        <DemoFrame className="max-w-xl space-y-4">
          <DateInput
            label="Interview date"
            value={interviewDate}
            onChange={(event) => setInterviewDate(event.target.value)}
          />
          <TimeInput label="Start time" defaultValue="14:30" />
          <DateTimeInput
            label="Scheduled at"
            value={scheduledAt}
            onChange={(event) => setScheduledAt(event.target.value)}
          />
          <DateInput label="With error" error="Pick a date" value="" onChange={() => undefined} />
          <DateInput
            label="Inline (table cell style)"
            variant="inline"
            value={interviewDate}
            onChange={(event) => setInterviewDate(event.target.value)}
          />
        </DemoFrame>
      </Section>

      {/* ——— OtpInput ——— */}
      <Section
        id="sg-otp-input"
        title="OtpInput"
        description="segmented digits · mask · paste · resend footer · VerificationInput alias"
        code={snippets.otpInput}
      >
        <DemoFrame className="max-w-xl space-y-3">
          <OtpInput
            onChange={setOtpCode}
            onResend={() => undefined}
            resendLoading={false}
          />
          <Text variant="open-regular-tiny" className="text-muted">
            Current code: {otpCode || '(empty)'}
          </Text>
          <OtpInput length={4} separatorAfterIndex={null} showResend={false} mask={false} />
          <Text variant="open-regular-tiny" className="text-muted">
            VerificationInput is the same component (alias export):
          </Text>
          <VerificationInput length={6} showResend={false} onChange={() => undefined} />
        </DemoFrame>
      </Section>

      {/* ——— Textarea ——— */}
      <Section id="sg-textarea" title="Textarea" description="error · disabled" code={snippets.textarea}>
        <DemoFrame label="Preview" className="max-w-xl">
          <div className="space-y-4">
            <Textarea label="Notes" placeholder="Optional" rows={3} />
            <Textarea label="With error" error="Too short" placeholder="…" rows={2} />
          </div>
        </DemoFrame>
      </Section>

      {/* ——— Checkbox ——— */}
      <Section id="sg-checkbox" title="Checkbox" description="checked · description · error · disabled" code={snippets.checkbox}>
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
          </div>
        </DemoFrame>
      </Section>

      {/* ——— Radio ——— */}
      <Section id="sg-radio" title="Radio / RadioGroup" description="value · description · disabled" code={snippets.radio}>
        <DemoFrame label="default">
          <RadioGroup label="Plan" defaultValue="pro" description="Pick a billing plan">
            <Radio value="starter" label="Starter" />
            <Radio value="pro" label="Pro" description="Most popular" />
            <Radio value="enterprise" label="Enterprise" disabled />
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
      <Section id="sg-switch" title="Switch" description="checked · description · error · disabled" code={snippets.switch}>
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
          </div>
        </DemoFrame>
      </Section>

      {/* ——— Select ——— */}
      <Section
        id="sg-select"
        title="Select"
        description="single · multiple · searchable · creatable · add new · loading · error · inline"
        code={snippets.select}
      >
        <DemoFrame className="max-w-xl space-y-4">
          <Select
            label="Single"
            placeholder="Select a role"
            value={role}
            onChange={(v) => setRole(v as string)}
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
            onChange={(v) => setRole(v as string)}
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
            onChange={(v) => setSkills(v as string[])}
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
            onChange={(v) => setRole(v as string)}
            createAction={{ label: 'Add new role…', onClick: () => setAddNewHint(true) }}
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
            value=""
            onChange={() => undefined}
            loading
            placeholder="…"
          />
          <Select
            label="Options error"
            options={[]}
            value=""
            onChange={() => undefined}
            loadError="Couldn't load options"
            onRetry={() => undefined}
            placeholder="…"
          />
          <Select
            label="Field error"
            error="Required"
            value=""
            onChange={() => undefined}
            options={[{ value: 'a', label: 'A' }]}
            placeholder="Choose…"
          />
          <Select
            label="Disabled"
            disabled
            value="installer"
            onChange={() => undefined}
            options={[{ value: 'installer', label: 'Installer' }]}
          />
          <Select
            label="With prefix"
            prefix={<Icon icon={Lock} size="sm" color="muted" />}
            value={role}
            onChange={(v) => setRole(v as string)}
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'installer', label: 'Installer' },
            ]}
          />
        </DemoFrame>
      </Section>

      <Section
        id="sg-file-upload"
        title="FileUpload"
        description="drag-drop · browse · autoUpload + injectable uploadFn · offline hooks from host app"
        code={snippets.fileUpload}
      >
        <DemoFrame className="max-w-xl space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Default Variant (Block)</h4>
            {/* 
              FileUpload Props Explained:
              - variant="default": The standard large dropzone block (default if omitted)
              - autoUpload: Defaults to true. Automatically uploads the file to sharedApi.uploadFiles. 
                            Set to false if you want to handle the file upload manually via onFileSelect.
              - onFileSelect: Fired when a file is selected (or when it is cleared). 
              - allowOfflineSave: Set to true to cache files in IndexedDB when the network is offline.
            */}
            <FileUpload
              label="Attachment"
              onFileSelect={(file) => console.log('Selected file:', file)}
              helperText="Only PDF, JPG, PNG allowed"
            />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Input Variant (Compact)</h4>
            {/* 
              - variant="input": A compact, single-line input style ideal for tighter forms.
              - multiple: Set to true to allow multiple file selections.
            */}
            <FileUpload
              variant="input"
              label="Profile Picture"
              onFileSelect={(file) => console.log('Selected file:', file)}
            />
          </div>
        </DemoFrame>
      </Section>

      {/* ——— DropdownMenu ——— */}
      <Section
        id="sg-dropdown-menu"
        title="DropdownMenu"
        description="actions menu · cursor-pointer trigger · portal positioning · permission gate hook"
        code={snippets.dropdownMenu}
      >
        <DemoFrame className="flex flex-wrap items-center gap-6">
          <DropdownMenu
            items={[
              { label: 'Edit', onClick: () => undefined },
              { label: 'Duplicate', onClick: () => undefined },
              { label: 'Delete', onClick: () => undefined, className: 'text-danger' },
            ]}
          />
          <DropdownMenu
            align="end"
            trigger={<Button size="sm" variant="ghost">Actions</Button>}
            items={[
              { label: 'Export CSV', onClick: () => undefined },
              { label: 'Archive', onClick: () => undefined, disabled: true },
            ]}
          />
        </DemoFrame>
      </Section>

      <TocGroupDivider title="Data" description="Editable and display-oriented data structures" />

      {/* ——— Table ——— */}
      <Section
        id="sg-table"
        title="Table"
        description="editable cells · readonly without focus outline · pagination (#F49E0C active page) · validation"
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
        <div className="mb-6 flex flex-wrap items-center gap-3">
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

        <DemoFrame
          label="display-only · click cells — no focus outline on readonly"
          wide
          className="!p-0"
        >
          <Table
            columns={[
              { key: 'project', label: 'Project', type: 'display', minWidth: '200px' },
              { key: 'owners', label: 'Owners', type: 'readonly', align: 'center', width: '100px' },
              { key: 'status', label: 'Status', type: 'string' },
            ]}
            rows={displayTableRows}
            showSerialNumbers
            showDeleteButton={false}
            editable={false}
            minWidth="560px"
          />
        </DemoFrame>

        <DemoFrame label="pagination · active page #F49E0C" wide className="!p-0 mt-6">
          <Table
            columns={[
              { key: 'project', label: 'Project', type: 'display', minWidth: '200px' },
              { key: 'owners', label: 'Owners', type: 'readonly', align: 'center', width: '100px' },
              { key: 'status', label: 'Status', type: 'string' },
            ]}
            rows={Array.from({ length: 12 }, (_, i) => ({
              id: i + 1,
              project: `Site ${i + 1}`,
              owners: (i % 4) + 1,
              status: i % 2 === 0 ? 'Active' : 'Pending',
            })).slice((tablePage - 1) * tableRowsPerPage, tablePage * tableRowsPerPage)}
            showSerialNumbers
            editable={false}
            paginated
            currentPage={tablePage}
            totalPages={Math.ceil(12 / tableRowsPerPage)}
            rowsPerPage={tableRowsPerPage}
            onPageChange={setTablePage}
            onRowsPerPageChange={(next) => {
              setTableRowsPerPage(next);
              setTablePage(1);
            }}
            minWidth="560px"
          />
        </DemoFrame>
      </Section>

      <TocGroupDivider title="Feedback" description="Overlays, toasts, and loading states" />

      {/* ——— ModalProvider / useModal ——— */}
      <Section
        id="sg-modal"
        title="ModalProvider / useModal"
        description="programmatic content · useSuccessModal · stacking · safe dismissal defaults"
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

      {/* ——— toast (imperative) ——— */}
      <Section
        id="sg-toast"
        title="toast (live)"
        description="imperative SDK toasts · error = danger · warning = destructive · theme-aware via styles.css"
        code={snippets.toast}
      >
        <DemoFrame label="Click to fire — look top-right (or bottom per option)">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => toast.success('Changes saved successfully.')}>
              success
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => toast.error('Could not save profile.', { title: 'Request failed' })}
            >
              error
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => toast.warning('Review required before publish.')}
            >
              warning
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toast.info('New catalog items are available.')}
            >
              info
            </Button>
            <Button
              size="sm"
              variant="underline"
              onClick={() =>
                toast.message('Maintenance window tonight 11pm–1am.', {
                  title: 'Scheduled',
                  autoClose: 10000,
                })
              }
            >
              message
            </Button>
          </div>
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

      {/* ——— Storefront Components ——— */}
      <TocGroupDivider title="Storefront" description="Layout shells and product components" />
      
      <Section
        id="sg-overview-card"
        title="OverviewCard"
        description="Statistical summary card with trend indicators"
        code=""
      >
        <DemoFrame>
          <div className="w-80">
            <OverviewCard
              title="Total Revenue"
              amount={125000}
              isCurrency={true}
              trendValue="12.5%"
              trendLabel="vs last month"
              trendDirection="up"
              icon={<NotificationBing />}
            />
          </div>
        </DemoFrame>
      </Section>

      <Section
        id="sg-product-card"
        title="ProductCard"
        description="Product listing card with image and specs"
        code=""
      >
        <DemoFrame>
          <div className="w-80">
            <ProductCard
              product={{
                id: 1,
                image: "https://via.placeholder.com/400x300",
                title: "Premium Solar Panel",
                amount: "₦ 150,000",
                description: "High efficiency monocrystalline solar panel for residential use.",
                status: "IN_STOCK"
              }}
            />
          </div>
        </DemoFrame>
      </Section>

      <Section
        id="sg-product-details"
        title="ProductDetailsLayout"
        description="Full product details layout with tabs and actions"
        code=""
      >
        <DemoFrame>
          <ProductDetailsLayout
            product={{
              id: 1,
              image: "https://via.placeholder.com/400x300",
              title: "Premium Solar Panel",
              amount: "₦ 150,000",
              description: "High efficiency monocrystalline solar panel for residential use.",
              status: "IN_STOCK"
            }}
          />
        </DemoFrame>
      </Section>
        </div>
      </PageTocLayout>
    </div>
  );
}
