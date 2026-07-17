import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Text, cn } from '@instollar-dev/instollar-sdk';

export type TocItem = { id: string; label: string };

export type TocGroup = {
  title: string;
  description?: string;
  items: TocItem[];
};

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function useActiveTocSection(itemIds: string[]) {
  const [active, setActive] = useState(itemIds[0] ?? '');

  useEffect(() => {
    const els = itemIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: '-18% 0px -62% 0px', threshold: [0, 0.15, 0.35, 0.6, 1] },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [itemIds]);

  return active;
}

function TocCategoryJump({
  groups,
  activeId,
  className,
}: {
  groups: TocGroup[];
  activeId: string;
  className?: string;
}) {
  const activeGroup = groups.find((group) => group.items.some((item) => item.id === activeId));

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {groups.map((group) => {
        const isActive = activeGroup?.title === group.title;
        return (
          <button
            key={group.title}
            type="button"
            onClick={() => scrollToSection(group.items[0]!.id)}
            className={cn(
              'docs-focus-ring inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-left transition-colors',
              isActive
                ? 'border-primary/25 bg-primary text-white'
                : 'border-border bg-white text-foreground hover:border-primary/20 hover:bg-primary/[0.03]',
            )}
          >
            <span className="text-open-regular-label font-medium">{group.title}</span>
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums',
                isActive ? 'bg-white/15 text-white/80' : 'bg-primary/[0.06] text-muted',
              )}
            >
              {group.items.length}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TocJumpSelect({
  groups,
  activeId,
  className,
}: {
  groups: TocGroup[];
  activeId: string;
  className?: string;
}) {
  return (
    <label className={cn('flex flex-col gap-1.5', className)}>
      <span className="text-open-regular-tiny font-medium text-muted">Jump to section</span>
      <select
        value={activeId}
        onChange={(event) => scrollToSection(event.target.value)}
        className="docs-focus-ring w-full rounded-xl border border-border bg-white px-3 py-2.5 text-open-regular-p text-foreground"
      >
        {groups.map((group) => (
          <optgroup key={group.title} label={group.title}>
            {group.items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

function TocRail({
  groups,
  activeId,
  title = 'On this page',
  className,
}: {
  groups: TocGroup[];
  activeId: string;
  title?: string;
  className?: string;
}) {
  const flat = groups.length === 1;

  return (
    <nav aria-label={title} className={cn('sticky top-8 w-[11.5rem] shrink-0', className)}>
      <p className="mb-4 text-[11px] font-medium tracking-[0.08em] text-muted uppercase">{title}</p>
      <div className="flex max-h-[calc(100vh-5.5rem)] flex-col gap-5 overflow-y-auto pr-1">
        {flat ? (
          <ul className="flex flex-col gap-0.5 border-l border-border/80">
            {groups[0]!.items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className={cn(
                      'docs-focus-ring block border-l-2 py-1 pl-3 text-open-regular-tiny transition-colors',
                      isActive
                        ? 'border-l-primary font-medium text-primary'
                        : 'border-l-transparent text-muted hover:border-l-primary/30 hover:text-foreground',
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          groups.map((group) => (
            <div key={group.title} className="flex flex-col gap-1.5">
              <p className="text-open-regular-tiny font-medium text-foreground/70">{group.title}</p>
              <ul className="flex flex-col gap-0.5 border-l border-border/80">
                {group.items.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(event) => {
                          event.preventDefault();
                          scrollToSection(item.id);
                        }}
                        className={cn(
                          'docs-focus-ring block border-l-2 py-1 pl-3 text-open-regular-tiny transition-colors',
                          isActive
                            ? 'border-l-primary font-medium text-primary'
                            : 'border-l-transparent text-muted hover:border-l-primary/30 hover:text-foreground',
                        )}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </nav>
  );
}

/** Grouped page navigation — category chips, mobile jump select, desktop right rail */
export function PageTocLayout({
  groups,
  children,
  railTitle = 'On this page',
}: {
  groups: TocGroup[];
  children: ReactNode;
  railTitle?: string;
}) {
  const itemIds = useMemo(() => groups.flatMap((group) => group.items.map((item) => item.id)), [groups]);
  const activeId = useActiveTocSection(itemIds);

  return (
    <div className="flex items-start gap-10 xl:gap-12">
      <div className="min-w-0 flex-1">
        <div className="mb-8 flex flex-col gap-4 xl:hidden">
          {groups.length > 1 ? (
            <TocCategoryJump groups={groups} activeId={activeId} />
          ) : null}
          <TocJumpSelect
            groups={groups}
            activeId={activeId}
            className={groups.length > 1 ? 'sm:hidden' : undefined}
          />
        </div>
        {children}
      </div>
      <TocRail groups={groups} activeId={activeId} title={railTitle} className="hidden xl:block" />
    </div>
  );
}

/** High-level category jump — useful below a page header on wide layouts */
export function PageTocOverview({
  groups,
  className,
}: {
  groups: TocGroup[];
  className?: string;
}) {
  const itemIds = useMemo(() => groups.flatMap((group) => group.items.map((item) => item.id)), [groups]);
  const activeId = useActiveTocSection(itemIds);

  return <TocCategoryJump groups={groups} activeId={activeId} className={className} />;
}

/** Visual break between grouped sections in long doc pages */
export function TocGroupDivider({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-t border-border/80 pt-10 not-first:mt-2">
      <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase">{title}</p>
      {description ? (
        <p className="mt-1 max-w-xl text-open-regular-tiny text-muted">{description}</p>
      ) : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  meta?: ReactNode;
}) {
  return (
    <header className="mb-10 flex flex-col gap-3 border-b border-border/80 pb-8">
      {eyebrow ? (
        <p className="text-open-regular-tiny font-medium tracking-[0.08em] text-muted uppercase">
          {eyebrow}
        </p>
      ) : null}
      <Text as="h1" variant="spline-bold-h4" className="max-w-[18ch] leading-tight">
        {title}
      </Text>
      <Text variant="open-regular-p" className="max-w-xl text-muted">
        {description}
      </Text>
      {meta ? <div className="mt-1 flex flex-wrap items-center gap-2">{meta}</div> : null}
    </header>
  );
}

export function Section({
  id,
  title,
  description,
  code,
  codeLabel = 'Example',
  children,
  className,
}: {
  id?: string;
  title: string;
  description?: string;
  code?: string;
  codeLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn('scroll-mt-28 flex flex-col gap-5', className)}>
      <div className="flex flex-col gap-1.5">
        <Text as="h2" variant="spline-bold-h5">
          {title}
        </Text>
        {description ? (
          <Text variant="open-regular-p" className="max-w-2xl text-muted">
            {description}
          </Text>
        ) : null}
      </div>
      {children}
      {code ? <CodeBlock label={codeLabel}>{code}</CodeBlock> : null}
    </section>
  );
}

export function SubSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <Text as="h3" variant="spline-bold-label">
          {title}
        </Text>
        {description ? (
          <Text variant="open-regular-tiny" className="mt-1 max-w-xl text-muted">
            {description}
          </Text>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export function StatusMark({
  status,
  children,
}: {
  status: 'shipped' | 'planned' | 'partial';
  children: ReactNode;
}) {
  const dot = {
    shipped: 'bg-primary',
    planned: 'bg-[var(--color-secondary,#effe3e)] ring-1 ring-primary/20',
    partial: 'bg-muted',
  } as const;

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-2.5 py-1 text-open-regular-tiny text-foreground">
      <span className={cn('size-1.5 rounded-full', dot[status])} aria-hidden />
      {children}
    </span>
  );
}

export function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'note';
  title: string;
  children: ReactNode;
}) {
  return (
    <aside
      className={cn(
        'flex flex-col gap-1.5 border-l-[3px] py-3 pl-4 pr-3',
        tone === 'info' ? 'border-l-primary bg-primary/[0.03]' : 'border-l-secondary bg-secondary/25',
      )}
    >
      <Text variant="spline-bold-label">{title}</Text>
      <div className="text-open-regular-p text-muted [&_strong]:text-foreground">{children}</div>
    </aside>
  );
}

export function CodeBlock({
  children,
  label = 'TypeScript',
  embedded = false,
}: {
  children: string;
  label?: string;
  embedded?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }, [children]);

  return (
    <div
      className={cn(
        'overflow-hidden text-[#e8f0ea]',
        embedded ? 'bg-[#0c1a12]' : 'rounded-xl border border-border bg-[#0c1a12] shadow-sm',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2',
          embedded && 'bg-[#0a1610]',
        )}
      >
        <span className="text-open-regular-tiny text-white/55">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="docs-focus-ring rounded-md px-2 py-1 text-open-regular-tiny text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}

/** Interactive demo frame — pass `code` to show Preview / Code tabs */
export function DemoFrame({
  label = 'Preview',
  code,
  codeLabel = 'TSX',
  children,
  className,
  wide,
}: {
  label?: string;
  code?: string;
  codeLabel?: string;
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  const [view, setView] = useState<'preview' | 'code'>('preview');

  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-white shadow-sm', wide && 'w-full')}>
      <div className="flex items-center justify-between gap-3 border-b border-border bg-[#fafbfa] px-3 py-2">
        <span className="text-open-regular-tiny text-muted">{label}</span>
        {code ? (
          <div className="flex rounded-lg border border-border bg-white p-0.5">
            {(['preview', 'code'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setView(tab)}
                className={cn(
                  'docs-focus-ring rounded-md px-2.5 py-1 text-[11px] font-medium capitalize transition-colors',
                  view === tab ? 'bg-primary text-white' : 'text-muted hover:text-foreground',
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {view === 'preview' || !code ? (
        <div className={cn('p-5', className)}>{children}</div>
      ) : (
        <CodeBlock label={codeLabel} embedded>
          {code}
        </CodeBlock>
      )}
    </div>
  );
}

/** @deprecated Use PageTocLayout for grouped navigation */
export function InPageNav({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const els = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-[4.5rem] z-[5] -mx-1 mb-8 overflow-x-auto border-b border-border/70 bg-[#f7f8f6]/95 px-1 py-2 backdrop-blur md:top-0"
    >
      <ul className="flex min-w-max gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                'docs-focus-ring inline-flex rounded-full px-3 py-1.5 text-open-regular-tiny transition-colors',
                active === item.id
                  ? 'bg-primary text-white'
                  : 'text-muted hover:bg-primary/5 hover:text-foreground',
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function StepList({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="flex flex-col gap-0 border-l border-border">
      {steps.map((step, index) => (
        <li key={step.title} className="relative flex gap-4 py-4 pl-6">
          <span className="absolute top-5 -left-[9px] flex size-[17px] items-center justify-center rounded-full border border-border bg-white text-[10px] font-semibold text-primary">
            {index + 1}
          </span>
          <div className="flex flex-col gap-1 pt-0.5">
            <Text variant="spline-bold-label">{step.title}</Text>
            <Text variant="open-regular-p" className="text-muted">
              {step.body}
            </Text>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function PillarCard({
  index,
  title,
  status,
  statusLabel,
  body,
  href,
  onNavigate,
}: {
  index: string;
  title: string;
  status: 'shipped' | 'planned' | 'partial';
  statusLabel: string;
  body: string;
  href: string;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (onNavigate) {
          e.preventDefault();
          onNavigate();
        }
      }}
      className="docs-focus-ring group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-white p-6 transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_12px_40px_-24px_rgba(1,43,21,0.45)]"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-open-regular-tiny font-medium text-muted">{index}</span>
        <StatusMark status={status}>{statusLabel}</StatusMark>
      </div>
      <div className="flex flex-col gap-2">
        <Text as="h3" variant="spline-bold-h5" className="transition-colors group-hover:text-primary">
          {title}
        </Text>
        <Text variant="open-regular-p" className="text-muted">
          {body}
        </Text>
      </div>
      <span className="mt-auto inline-flex items-center gap-1.5 text-open-regular-tiny font-medium text-primary">
        Open
        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </a>
  );
}
