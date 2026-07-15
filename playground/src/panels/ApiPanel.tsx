import { useState } from 'react';
import { cn, Text } from '@codearemo/instollar-sdk';
import {
  Callout,
  CodeBlock,
  DemoFrame,
  PageHeader,
  PageTocLayout,
  Section,
  SubSection,
} from '../ui';
import {
  apiBaseUrls,
  apiEndpointDomains,
  apiResponseSnippet,
  apiSetupSnippet,
  type EndpointDomain,
  type EndpointRow,
} from '../apiEndpointCatalog';

const apiNav = [
  {
    title: 'Topics',
    items: [
      { id: 'api-setup', label: 'Setup' },
      { id: 'api-bases', label: 'Base URLs' },
      { id: 'api-envelope', label: 'Responses' },
      { id: 'api-domains', label: 'Domains' },
    ],
  },
];

function EndpointTable({ rows }: { rows: EndpointRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white">
      <table className="w-full min-w-[40rem] text-left text-open-regular-tiny">
        <thead className="border-b border-border bg-[#fafbfa] text-muted">
          <tr>
            <th className="px-3 py-2 font-medium">Method</th>
            <th className="px-3 py-2 font-medium">Path</th>
            <th className="px-3 py-2 font-medium">SDK function</th>
            <th className="px-3 py-2 font-medium">Response</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, index) => (
            <tr key={`${row.method}-${row.path}-${row.fn}-${index}`}>
              <td className="px-3 py-2.5 font-mono text-[11px]">{row.method}</td>
              <td className="px-3 py-2.5 font-mono text-[11px] text-muted">{row.path}</td>
              <td className="px-3 py-2.5">
                <code className="text-[11px]">{row.fn}</code>
              </td>
              <td className="px-3 py-2.5 font-mono text-[11px] text-muted">{row.response}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EndpointCatalog({ domain }: { domain: EndpointDomain }) {
  const example = domain.sections
    .flatMap((section) => section.endpoints)
    .find((row) => row.fn.includes('.'));

  return (
    <div className="flex flex-col gap-8">
      {domain.sections.map((section) => (
        <div key={section.title}>
          <Text variant="spline-bold-label" className="mb-3 block">
            {section.title}
          </Text>
          <Text variant="open-regular-tiny" className="mb-3 text-muted">
            {section.endpoints.length} endpoint{section.endpoints.length === 1 ? '' : 's'}
          </Text>
          <EndpointTable rows={section.endpoints} />
        </div>
      ))}
      <CodeBlock label="Usage">{`import { ${domain.sdkExport} } from '@codearemo/instollar-sdk';

// Example — see tables above for full list
const result = await ${domain.sdkExport}.${example?.fn.includes('.') ? example.fn.split('.')[1] : '…'}(/* … */);`}</CodeBlock>
    </div>
  );
}

export function ApiPanel() {
  const [activeDomain, setActiveDomain] = useState(apiEndpointDomains[0]!.id);
  const current = apiEndpointDomains.find((d) => d.id === activeDomain)!;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Chapter 01"
        title="API layer"
        description="Typed SDK functions over Instollar HTTP — paths from the webapp reference, axios + auth wired once."
      />

      <PageTocLayout groups={apiNav} railTitle="API">
        <div className="flex flex-col gap-12">
          <Section
            id="api-setup"
            title="SDK setup"
            description="Initialize storage + axios once. Role-specific bases route admin, company, and installer calls."
            code={apiSetupSnippet}
          >
            <Callout tone="info" title="Mirrors instollar-webappV2">
              Endpoint list sourced from <code className="text-xs">docs/API_ENDPOINTS.md</code> in
              the webapp repo. SDK path constants live in{' '}
              <code className="text-xs">core/api/api-endpoints.ts</code>; domain functions in{' '}
              <code className="text-xs">domains/*</code>.
            </Callout>
          </Section>

          <Section
            id="api-bases"
            title="Base URLs"
            description="Four service roots — BASE is the axios default; others are passed via baseUrls."
          >
            <DemoFrame label="Service aliases" className="!p-0">
              <table className="w-full text-left text-open-regular-tiny">
                <thead className="border-b border-border bg-[#fafbfa] text-muted">
                  <tr>
                    <th className="px-4 py-2 font-medium">Alias</th>
                    <th className="px-4 py-2 font-medium">Env var</th>
                    <th className="px-4 py-2 font-medium">Used for</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {apiBaseUrls.map((row) => (
                    <tr key={row.alias}>
                      <td className="px-4 py-3 font-mono text-[11px]">{row.alias}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-muted">{row.env}</td>
                      <td className="px-4 py-3 text-muted">{row.usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DemoFrame>
          </Section>

          <Section
            id="api-envelope"
            title="Response envelopes"
            description="Every domain function returns the unwrapped API body (axios response.data)."
            code={apiResponseSnippet}
          >
            <SubSection title="Naming convention">
              <p className="max-w-2xl text-open-regular-p text-muted">
                Inner payload types end with <code className="text-xs">Model</code> — e.g.{' '}
                <code className="text-xs">ApiResponse&lt;CompanyProfileModel&gt;</code>. Do not
                repeat &quot;Response&quot; on the inner type; the envelope is already{' '}
                <code className="text-xs">ApiResponse</code> or{' '}
                <code className="text-xs">PaginatedApiResponse</code>.
              </p>
            </SubSection>
          </Section>

          <Section
            id="api-domains"
            title="Endpoint domains"
            description="Browse by portal — auth, shared, admin, company, and installer."
          >
            <div className="flex flex-wrap gap-2">
              {apiEndpointDomains.map((domain) => (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => setActiveDomain(domain.id)}
                  className={cn(
                    'docs-focus-ring rounded-lg border px-3 py-2 text-left transition-colors',
                    activeDomain === domain.id
                      ? 'border-primary/25 bg-primary text-white'
                      : 'border-border bg-white hover:border-primary/20',
                  )}
                >
                  <span className="block text-open-regular-label font-medium">{domain.title}</span>
                  <span
                    className={cn(
                      'mt-0.5 block text-open-regular-tiny',
                      activeDomain === domain.id ? 'text-white/70' : 'text-muted',
                    )}
                  >
                    {domain.endpointCount} endpoints · {domain.sdkExport}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <Text variant="spline-bold-label">{current.title}</Text>
                <Text variant="open-regular-tiny" className="mt-1 text-muted">
                  {current.summary} · service: {current.service} · export:{' '}
                  <code>{current.sdkExport}</code>
                </Text>
              </div>
              <EndpointCatalog domain={current} />
            </div>
          </Section>
        </div>
      </PageTocLayout>
    </div>
  );
}
