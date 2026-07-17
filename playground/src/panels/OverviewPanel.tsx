import type { PillarId } from '../nav';
import {
  Callout,
  CodeBlock,
  PageHeader,
  PillarCard,
  Section,
  StatusMark,
  StepList,
} from '../ui';

const pillars = [
  {
    id: 'api' as const,
    index: '01',
    title: 'API layer',
    status: 'shipped' as const,
    statusLabel: 'Live',
    body: 'Typed HTTP functions over Instollar backends — auth, shared, admin, company, and installer domain APIs.',
  },
  {
    id: 'style' as const,
    index: '02',
    title: 'Style guide',
    status: 'shipped' as const,
    statusLabel: 'Live',
    body: 'Tokens, typography, and React UI — published as @instollar-dev/instollar-sdk with precompiled styles.css.',
  },
  {
    id: 'logic' as const,
    index: '03',
    title: 'Special logic',
    status: 'partial' as const,
    statusLabel: 'Growing',
    body: 'Shared behaviors between API and UI — formatting, async adapters, field chrome, toasts, and Places helpers.',
  },
];

/** Style guide sections — deep-link via #style/{id} */
const styleGuideHighlights: { id: string; label: string; note?: string }[] = [
  { id: 'sg-theme', label: 'ThemeProvider', note: 'light / dark / system' },
  { id: 'sg-button', label: 'Button', note: 'includes underline variant' },
  { id: 'sg-address-autocomplete', label: 'AddressAutocomplete', note: 'Places API (New)' },
  { id: 'sg-date-input', label: 'DateInput / TimeInput / DateTimeInput' },
  { id: 'sg-otp-input', label: 'OtpInput / VerificationInput' },
  { id: 'sg-dropdown-menu', label: 'DropdownMenu' },
  { id: 'sg-select', label: 'Select' },
  { id: 'sg-table', label: 'Table' },
  { id: 'sg-modal', label: 'ModalProvider' },
  { id: 'sg-drawer', label: 'DrawerProvider' },
  { id: 'sg-load', label: 'LoadBoundary' },
  { id: 'sg-alert', label: 'Alert', note: 'toast appearance' },
  { id: 'sg-toast', label: 'toast (live triggers)', note: 'imperative API' },
];

const logicHighlights: { id: PillarId; section: string; label: string }[] = [
  { id: 'logic', section: 'lg-toast', label: 'Toasts (axios metadata)' },
  { id: 'logic', section: 'lg-places', label: 'Address autocomplete setup' },
  { id: 'logic', section: 'lg-async', label: 'Query adapters (Select / LoadBoundary)' },
];

export function OverviewPanel({
  onNavigate,
}: {
  onNavigate: (id: PillarId, styleOrLogicSectionId?: string) => void;
}) {
  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        eyebrow="Start here"
        title="One SDK. Three pillars."
        description="Instollar apps share the same client shape, visual language, and non-trivial logic. Use this playground as the living docs — chapter by chapter."
        meta={
          <>
            <StatusMark status="shipped">Style shipped</StatusMark>
            <StatusMark status="shipped">API live</StatusMark>
            <StatusMark status="partial">Logic partial</StatusMark>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {pillars.map((pillar) => (
          <PillarCard
            key={pillar.id}
            index={pillar.index}
            title={pillar.title}
            status={pillar.status}
            statusLabel={pillar.statusLabel}
            body={pillar.body}
            href={`#${pillar.id}`}
            onNavigate={() => onNavigate(pillar.id)}
          />
        ))}
      </div>

      <Section
        title="UI components in the playground"
        description="Every export has a live section under Style guide (right rail or jump menu). Recent additions in 0.4.x:"
      >
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {styleGuideHighlights.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onNavigate('style', item.id)}
                className="docs-focus-ring flex w-full flex-col rounded-xl border border-border bg-background px-3 py-2.5 text-left transition-colors hover:border-primary/25 hover:bg-primary/[0.03]"
              >
                <span className="text-open-regular-label font-medium text-foreground">
                  {item.label}
                </span>
                {item.note ? (
                  <span className="text-open-regular-tiny text-muted">{item.note}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onNavigate('style')}
          className="docs-focus-ring mt-4 text-open-regular-label font-medium text-primary hover:underline"
        >
          Open full style guide →
        </button>
      </Section>

      <Section title="Special logic topics" description="Helpers that are not full components — still documented here.">
        <ul className="flex flex-col gap-2">
          {logicHighlights.map((item) => (
            <li key={item.section}>
              <button
                type="button"
                onClick={() => onNavigate(item.id, item.section)}
                className="docs-focus-ring text-open-regular-p text-primary hover:underline"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Suggested path" description="Fastest way to get oriented if you are new to the SDK.">
        <StepList
          steps={[
            {
              title: 'Skim the API chapter',
              body: 'See how calls will look and why responses will share one envelope — even before the client ships.',
            },
            {
              title: 'Work the style guide',
              body: 'Install patterns, tokens, and live components. Copy snippets into your app as you go.',
            },
            {
              title: 'Wire special logic',
              body: 'Prefer SDK helpers for numbers, loading shells, toasts, and address fields so every Instollar product feels the same.',
            },
          ]}
        />
      </Section>

      <Section title="Install once">
        <CodeBlock label="Terminal + React">{`pnpm add @instollar-dev/instollar-sdk@^0.4.2
pnpm add -D tailwindcss@^4.1.0

import '@instollar-dev/instollar-react/styles.css';
import { ThemeProvider, Button, Text } from '@instollar-dev/instollar-sdk';`}</CodeBlock>
        <Callout tone="note" title="Auth for GitHub Packages">
          Create a root <strong>.npmrc</strong> pointing <strong>@instollar-dev</strong> at{' '}
          <strong>npm.pkg.github.com</strong>, with <strong>NODE_AUTH_TOKEN</strong> that has{' '}
          <strong>read:packages</strong>.
        </Callout>
        <Callout tone="note" title="Light / dark theme">
          Wrap the app in <code>ThemeProvider</code> and toggle with <code>useTheme()</code>. Prefer{' '}
          <code>bg-background</code>, <code>text-foreground</code>, and <code>bg-brand</code> so UI
          follows the theme. Try the Dark / Light control in the playground sidebar — or open{' '}
          <button
            type="button"
            className="font-medium text-primary underline"
            onClick={() => onNavigate('style', 'sg-theme')}
          >
            ThemeProvider
          </button>{' '}
          in the style guide.
        </Callout>
        <Callout tone="note" title="Google Places (optional)">
          For <code>AddressAutocomplete</code>, enable Places API (New) in Google Cloud and pass{' '}
          <code>googlePlacesApiKey</code> to <code>initInstollarSDK</code> or <code>apiKey</code> on
          the component. In this repo only, add{' '}
          <code>VITE_GOOGLE_PLACES_API_KEY</code> to <code>playground/.env.local</code> for live
          demos.
        </Callout>
      </Section>
    </div>
  );
}
