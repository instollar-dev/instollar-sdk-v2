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
    statusLabel: 'Live in 0.2.x',
    body: 'Tokens, typography, and React UI — published as @codearemo/instollar-sdk with precompiled styles.css.',
  },
  {
    id: 'logic' as const,
    index: '03',
    title: 'Special logic',
    status: 'partial' as const,
    statusLabel: 'Growing',
    body: 'Shared behaviors between API and UI — formatting, async adapters, field chrome, floating menus, and more.',
  },
];

export function OverviewPanel({ onNavigate }: { onNavigate: (id: PillarId) => void }) {
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
              body: 'Prefer SDK helpers for numbers, loading shells, and field chrome so every Instollar product feels the same.',
            },
          ]}
        />
      </Section>

      <Section title="Install once">
        <CodeBlock label="Terminal + React">{`npm install @codearemo/instollar-sdk@^0.2.5
npm install -D tailwindcss@^4.1.0

import '@codearemo/instollar-react/styles.css';
import { Button, Text } from '@codearemo/instollar-sdk';`}</CodeBlock>
        <Callout tone="note" title="Auth for GitHub Packages">
          Create a root <strong>.npmrc</strong> pointing <strong>@codearemo</strong> at{' '}
          <strong>npm.pkg.github.com</strong>, with <strong>NODE_AUTH_TOKEN</strong> that has{' '}
          <strong>read:packages</strong>.
        </Callout>
        <Callout tone="note" title="Tailwind class autocomplete">
          Install the <strong>Tailwind CSS IntelliSense</strong> extension, then point it at{' '}
          <code>node_modules/@codearemo/instollar-react/theme.css</code> via{' '}
          <code>tailwindCSS.experimental.configFile</code> (copy{' '}
          <code>templates/vscode/</code> from the SDK repo). That unlocks suggestions for{' '}
          <code>bg-primary</code>, <code>text-spline-bold-h4</code>, and standard utilities.
          Runtime styles still come from <code>styles.css</code> alone.
        </Callout>
      </Section>
    </div>
  );
}
