import { useMemo, useState } from 'react';
import {
  Alert,
  Button,
  FieldControl,
  formatAmountInput,
  formatAsTyping,
  formatCompactAmount,
  formatCurrencyLabel,
  formatDate,
  formatDateTime,
  formatMoney,
  formatNumberWithGrouping,
  formatPhoneForApi,
  formatNumberInput,
  getApiErrorMessage,
  isNetworkDisconnectError,
  LoadBoundary,
  loadBoundaryPropsFromQuery,
  maskEmailForOtpHint,
  normalizePhoneForApi,
  normalizeString,
  numberInputRawValue,
  parseAmountInput,
  sanitizeNumberInput,
  Select,
  selectOptionsPropsFromQuery,
  Text,
  toastVariantFromApi,
  formFieldErrorClass,
  formFieldLabelClass,
} from '@instollar-dev/instollar-sdk';
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
      { id: 'lg-dates', label: 'Dates' },
      { id: 'lg-money', label: 'Money' },
      { id: 'lg-strings-phone', label: 'Strings & phone' },
      { id: 'lg-validation-errors', label: 'Validation & errors' },
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
              <FieldControl>
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
} from '@instollar-dev/instollar-sdk';

formatNumberInput('250000'); // '250,000'
numberInputRawValue('250,000'); // '250000'`}</CodeBlock>
        </div>
      </Section>

      <Section
        id="lg-dates"
        title="Date and time helpers"
        description="date-fns-backed formatters accept Date, ISO strings, and millisecond timestamps. Invalid values return an empty string."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <DemoFrame label="Examples">
            <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 text-open-regular-p">
              <dt className="text-muted">formatDate</dt>
              <dd>{formatDate('2025-08-22')}</dd>
              <dt className="text-muted">formatDateTime</dt>
              <dd>{formatDateTime('2025-08-22T14:30:00')}</dd>
              <dt className="text-muted">invalid input</dt>
              <dd>{formatDate('not-a-date') || '"" (empty string)'}</dd>
            </dl>
          </DemoFrame>
          <CodeBlock>{`import {
  formatDate,
  formatDateTime,
  formatDateSmart,
  formatRelative,
  toDateInputValue,
} from '@instollar-dev/instollar-sdk/utils/dateTime';

formatDate('2025-08-22'); // "Fri, 22nd Aug, 2025"
toDateInputValue(apiDate); // "2025-08-22"`}</CodeBlock>
        </div>
      </Section>

      <Section
        id="lg-money"
        title="Money helpers"
        description="Two intentionally distinct APIs prevent the app's former formatCurrency name collision."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <DemoFrame label="Examples">
            <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 text-open-regular-p">
              <dt className="text-muted">formatMoney</dt>
              <dd>{formatMoney(1_500_000, { currency: 'NGN' })}</dd>
              <dt className="text-muted">compact money</dt>
              <dd>{formatMoney(1_500_000, { currency: 'NGN', useShorthand: true })}</dd>
              <dt className="text-muted">currency label</dt>
              <dd>{formatCurrencyLabel(1500, 'NGN')}</dd>
              <dt className="text-muted">no currency</dt>
              <dd>{formatCurrencyLabel(1500, null)}</dd>
            </dl>
          </DemoFrame>
          <CodeBlock>{`import {
  formatMoney,
  formatCurrencyLabel,
  formatCompactAmount,
} from '@instollar-dev/instollar-sdk/utils/money';

formatMoney(1500000, { currency: 'NGN' });
formatCurrencyLabel(1500, 'NGN'); // "NGN 1,500"
formatCompactAmount(1200); // "1.2K"`}</CodeBlock>
        </div>
      </Section>

      <Section
        id="lg-strings-phone"
        title="Number, string, and phone normalization"
        description="Display formatting stays separate from API normalization."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <DemoFrame label="Examples">
            <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 text-open-regular-p">
              <dt className="text-muted">grouped number</dt>
              <dd>{formatNumberWithGrouping('12345.5')}</dd>
              <dt className="text-muted">typing state</dt>
              <dd>{formatAsTyping('1234.')}</dd>
              <dt className="text-muted">enum label</dt>
              <dd>{normalizeString('PENDING_QA')}</dd>
              <dt className="text-muted">OTP email</dt>
              <dd>{maskEmailForOtpHint('john@example.com')}</dd>
              <dt className="text-muted">API phone</dt>
              <dd>{formatPhoneForApi({ phoneCode: '+234', nationalNumber: '801 234 5678' })}</dd>
            </dl>
          </DemoFrame>
          <CodeBlock>{`import {
  formatAmountInput,
  parseAmountInput,
  normalizeString,
  formatPhoneForApi,
  normalizePhoneForApi,
} from '@instollar-dev/instollar-sdk';

formatAmountInput('1234.50'); // "1,234.50"
parseAmountInput('1,234.50'); // 1234.5
normalizeString('PENDING_QA'); // "Pending Qa"
formatPhoneForApi({ phoneCode: '+234', nationalNumber: '801 234 5678' });
normalizePhoneForApi('+2348012345678');`}</CodeBlock>
        </div>
        <p className="text-open-regular-tiny text-muted">
          Input formatter example: {formatAmountInput('1234.50')} → {parseAmountInput('1,234.50')}.
          Compact amount: {formatCompactAmount(1200)}. Normalized phone: {normalizePhoneForApi('+234801')}.
        </p>
      </Section>

      <Section
        id="lg-validation-errors"
        title="Validation and API errors"
        description="validateForm flattens Zod errors; error helpers accept unknown axios-like values without framework coupling."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <DemoFrame label="Error extraction">
            <div className="flex flex-col gap-2 text-open-regular-p">
              <p>
                {getApiErrorMessage({
                  response: { data: { message: 'The server rejected this request.' } },
                })}
              </p>
              <p className="text-open-regular-tiny text-muted">
                Disconnect detected:{' '}
                {String(isNetworkDisconnectError({ request: {}, response: undefined }))}
              </p>
            </div>
          </DemoFrame>
          <CodeBlock>{`import { z } from 'zod';
import {
  validateForm,
  getApiErrorMessage,
  isNetworkDisconnectError,
} from '@instollar-dev/instollar-sdk';

const schema = z.object({ email: z.string().email('Invalid email') });
const result = validateForm(schema, formData);
if (!result.success) setErrors(result.fieldErrors);

getApiErrorMessage(query.error);
isNetworkDisconnectError(query.error);`}</CodeBlock>
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
              <FieldControl>
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
} from '@instollar-dev/instollar-sdk';`}</CodeBlock>
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
              ['Class maps', 'Alerts and status badges'],
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
