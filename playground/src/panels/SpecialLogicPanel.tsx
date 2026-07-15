import { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  FieldControl,
  formatNumberInput,
  LoadBoundary,
  loadBoundaryPropsFromQuery,
  numberInputRawValue,
  sanitizeNumberInput,
  Select,
  selectOptionsPropsFromQuery,
  Text,
  toastVariantFromApi,
  formFieldErrorClass,
  formFieldLabelClass,
} from '@codearemo/instollar-sdk';
import {
  CodeBlock,
  DemoFrame,
  PageHeader,
  PageTocLayout,
  Section,
  StatusMark,
  SubSection,
} from '../ui';

const logicNav = [
  {
    title: 'Topics',
    items: [
      { id: 'lg-numbers', label: 'Numbers' },
      { id: 'lg-async', label: 'Async' },
      { id: 'lg-toast', label: 'Toasts' },
      { id: 'lg-field', label: 'Fields' },
      { id: 'lg-more', label: 'Also exported' },
    ],
  },
];

function useFakeJobsQuery(mode: 'ok' | 'loading' | 'error') {
  return useMemo(() => {
    if (mode === 'loading') {
      return {
        isPending: true,
        isError: false,
        data: undefined as { value: string; label: string }[] | undefined,
        error: null as Error | null,
        refetch: () => undefined,
      };
    }
    if (mode === 'error') {
      return {
        isPending: false,
        isError: true,
        data: undefined as { value: string; label: string }[] | undefined,
        error: new Error('Network unavailable'),
        refetch: () => undefined,
      };
    }
    return {
      isPending: false,
      isError: false,
      data: [
        { value: 'job-1', label: 'Roof survey' },
        { value: 'job-2', label: 'Inverter install' },
      ],
      error: null as Error | null,
      refetch: () => undefined,
    };
  }, [mode]);
}

export function SpecialLogicPanel() {
  const [amountDisplay, setAmountDisplay] = useState(formatNumberInput('250000'));
  const [queryMode, setQueryMode] = useState<'ok' | 'loading' | 'error'>('ok');
  const [apiToast, setApiToast] = useState<'success' | 'error'>('success');
  const [job, setJob] = useState('job-1');

  const jobsQuery = useFakeJobsQuery(queryMode);
  const rawAmount = numberInputRawValue(amountDisplay);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Chapter 03"
        title="Special logic"
        description="Shared behaviors between API data and UI. Prefer these exports over reinventing formatting, loading shells, or field chrome in each app."
        meta={<StatusMark status="partial">Partial · expanding</StatusMark>}
      />

      <PageTocLayout groups={logicNav} railTitle="Topics">
        <div className="flex flex-col gap-12">

      <Section
        id="lg-numbers"
        title="Number helpers"
        description="Powers Input type=&quot;number&quot; — also available for custom fields."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <DemoFrame label="Live">
            <div className="flex flex-col gap-3">
              <label className={formFieldLabelClass}>Amount</label>
              <FieldControl variant="light">
                <input
                  className="w-full bg-transparent px-3 py-2 text-open-regular-p outline-none"
                  value={amountDisplay}
                  onChange={(e) => {
                    const sanitized = sanitizeNumberInput(e.target.value);
                    setAmountDisplay(formatNumberInput(sanitized));
                  }}
                />
              </FieldControl>
              <Text variant="open-regular-tiny" className="text-muted">
                Raw for APIs:{' '}
                <span className="font-medium text-foreground">{rawAmount || '—'}</span>
              </Text>
            </div>
          </DemoFrame>
          <CodeBlock>{`import {
  sanitizeNumberInput,
  formatNumberInput,
  numberInputRawValue,
} from '@codearemo/instollar-sdk';

formatNumberInput('250000'); // '250,000'
numberInputRawValue('250,000'); // '250000'`}</CodeBlock>
        </div>
      </Section>

      <Section
        id="lg-async"
        title="Async adapters"
        description="Map TanStack Query–shaped objects into Select / LoadBoundary without coupling the SDK to Query."
      >
        <div className="mb-3 flex flex-wrap gap-2">
          {(['ok', 'loading', 'error'] as const).map((mode) => (
            <Button
              key={mode}
              size="sm"
              variant={queryMode === mode ? 'primary' : 'ghost'}
              onClick={() => setQueryMode(mode)}
            >
              {mode}
            </Button>
          ))}
        </div>

        <SubSection title="selectOptionsPropsFromQuery">
          <div className="grid gap-4 lg:grid-cols-2">
            <DemoFrame>
              <Select
                label="Jobs"
                value={job}
                onValueChange={(v) => setJob(v as string)}
                options={jobsQuery.data ?? []}
                {...selectOptionsPropsFromQuery(jobsQuery)}
                onReloadOptions={() => setQueryMode('ok')}
              />
            </DemoFrame>
            <CodeBlock>{`<Select
  options={query.data ?? []}
  {...selectOptionsPropsFromQuery(query)}
/>`}</CodeBlock>
          </div>
        </SubSection>

        <SubSection title="loadBoundaryPropsFromQuery">
          <div className="grid gap-4 lg:grid-cols-2">
            <DemoFrame>
              <LoadBoundary
                {...loadBoundaryPropsFromQuery(jobsQuery)}
                onRetry={() => setQueryMode('ok')}
                minHeight={140}
              >
                <Text variant="open-regular-p">
                  {(jobsQuery.data ?? []).map((j) => j.label).join(', ') || '—'}
                </Text>
              </LoadBoundary>
            </DemoFrame>
            <CodeBlock>{`<LoadBoundary
  {...loadBoundaryPropsFromQuery(query)}
  onRetry={() => query.refetch()}
>
  <Page data={query.data} />
</LoadBoundary>`}</CodeBlock>
          </div>
        </SubSection>
      </Section>

      <Section
        id="lg-toast"
        title="toastVariantFromApi"
        description="Map a simple API success/error flag onto Alert variants."
      >
        <div className="mb-3 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={apiToast === 'success' ? 'primary' : 'ghost'}
            onClick={() => setApiToast('success')}
          >
            success
          </Button>
          <Button
            size="sm"
            variant={apiToast === 'error' ? 'destructive' : 'ghost'}
            onClick={() => setApiToast('error')}
          >
            error
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Alert
            appearance="toast"
            variant={toastVariantFromApi(apiToast)}
            title={apiToast === 'success' ? 'Saved' : 'Failed'}
          >
            toastVariantFromApi(&apos;{apiToast}&apos;) → {toastVariantFromApi(apiToast)}
          </Alert>
          <CodeBlock>{`<Alert
  appearance="toast"
  variant={toastVariantFromApi(api.type)}
/>`}</CodeBlock>
        </div>
      </Section>

      <Section
        id="lg-field"
        title="Field chrome"
        description="Compose custom controls with the same look as Input / Select."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <DemoFrame>
            <div className="flex flex-col gap-2">
              <label className={formFieldLabelClass}>Custom field</label>
              <FieldControl variant="light">
                <input
                  className="w-full bg-transparent px-3 py-2 text-open-regular-p outline-none"
                  placeholder="Compose with FieldControl"
                />
              </FieldControl>
              <p className={formFieldErrorClass}>Example error using formFieldErrorClass</p>
            </div>
          </DemoFrame>
          <CodeBlock>{`import {
  FieldControl,
  formFieldLabelClass,
  formFieldErrorClass,
} from '@codearemo/instollar-sdk';`}</CodeBlock>
        </div>
      </Section>

      <Section
        id="lg-more"
        title="Also exported"
        description="Hooks and utilities used by SDK components — available for custom overlays."
      >
        <DemoFrame>
          <ul className="flex flex-col divide-y divide-border">
            {[
              ['useClickOutside', 'Close popovers when pointer leaves'],
              ['useFloatingPosition', 'Flip / clamp dropdowns (powers Select)'],
              ['cn', 'clsx + tailwind-merge'],
              ['Input type="password"', 'Built-in show / hide'],
              ['Class maps', 'Alerts, segmented tabs, status badges'],
            ].map(([name, body]) => (
              <li key={name} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-4">
                <code className="shrink-0 text-open-regular-tiny font-medium text-foreground">
                  {name}
                </code>
                <span className="text-open-regular-tiny text-muted">{body}</span>
              </li>
            ))}
          </ul>
        </DemoFrame>
      </Section>
        </div>
      </PageTocLayout>
    </div>
  );
}
