import { useEffect, useState } from 'react';
import { cn } from '@codearemo/instollar-sdk';
import { nav, resolvePillar, type PillarId } from './nav';
import { OverviewPanel } from './panels/OverviewPanel';
import { ApiPanel } from './panels/ApiPanel';
import { StyleGuidePanel } from './panels/StyleGuidePanel';
import { SpecialLogicPanel } from './panels/SpecialLogicPanel';

export function App() {
  const [pillar, setPillar] = useState<PillarId>(() =>
    typeof window === 'undefined' ? 'overview' : resolvePillar(window.location.hash),
  );

  useEffect(() => {
    const onHash = () => setPillar(resolvePillar(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Direct hash loads (e.g. /#style) and in-app nav must start the chapter at the top.
  // Pillar panels remount via key={pillar}; scroll after that paint.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pillar]);

  function go(id: PillarId) {
    setPillar(id);
    window.location.hash = id;
  }

  const current = nav.find((n) => n.id === pillar)!;
  const idx = nav.findIndex((n) => n.id === pillar);

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[90rem]">
        <aside className="sticky top-0 hidden h-screen w-[var(--docs-rail)] shrink-0 flex-col border-r border-border/80 bg-white/70 px-4 py-7 backdrop-blur-md lg:flex">
          <div className="mb-10 px-2">
            <p className="font-spline text-[1.35rem] font-bold tracking-tight text-primary">
              Instollar
            </p>
            <p className="mt-1 text-open-regular-tiny text-muted">SDK docs · v0.2.4</p>
          </div>

          <nav className="flex flex-1 flex-col gap-0.5" aria-label="SDK chapters">
            {nav.map((item) => {
              const active = pillar === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  className={cn(
                    'docs-focus-ring group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors',
                    active ? 'bg-primary text-white' : 'hover:bg-primary/4',
                  )}
                >
                  <span
                    className={cn(
                      'mt-0.5 font-mono text-[11px] tracking-wide',
                      active ? 'text-white/55' : 'text-muted',
                    )}
                  >
                    {item.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-open-regular-label font-medium">{item.label}</span>
                    {active ? (
                      <span className="mt-0.5 block text-open-regular-tiny leading-snug text-white/65">
                        {item.hint}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 border-t border-border/70 px-2 pt-5">
            <p className="text-open-regular-tiny leading-relaxed text-muted">
              Style guide groups components by category — use the right rail or jump menu to navigate.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-20 border-b border-border/80 bg-[#f7f8f6]/90 px-4 pt-4 pb-3 backdrop-blur-md lg:hidden">
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <p className="font-spline text-lg font-bold text-primary">Instollar</p>
              <span className="text-open-regular-tiny text-muted">v0.2.4</span>
            </div>
            <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
              {nav.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  className={cn(
                    'docs-focus-ring shrink-0 rounded-full px-3.5 py-1.5 text-open-regular-tiny font-medium transition-colors',
                    pillar === item.id
                      ? 'bg-primary text-white'
                      : 'bg-white text-foreground ring-1 ring-border',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
            <div key={pillar} className="docs-enter mx-auto w-full max-w-(--docs-wide)">
              <div className="mb-2 hidden items-center gap-2 lg:flex">
                <span className="font-mono text-open-regular-tiny text-muted">{current.number}</span>
                <span className="text-open-regular-tiny text-muted/40">/</span>
                <span className="text-open-regular-tiny text-muted">{current.hint}</span>
              </div>

              {pillar === 'overview' ? <OverviewPanel onNavigate={go} /> : null}
              {pillar === 'api' ? <ApiPanel /> : null}
              {pillar === 'style' ? <StyleGuidePanel /> : null}
              {pillar === 'logic' ? <SpecialLogicPanel /> : null}

              <footer className="mt-16 flex items-center justify-between gap-4 border-t border-border/80 pt-6 text-open-regular-tiny text-muted">
                <span>Instollar SDK playground</span>
                <div className="flex gap-4">
                  {idx > 0 ? (
                    <button
                      type="button"
                      className="docs-focus-ring font-medium text-primary hover:underline"
                      onClick={() => go(nav[idx - 1]!.id)}
                    >
                      ← {nav[idx - 1]!.label}
                    </button>
                  ) : (
                    <span />
                  )}
                  {idx < nav.length - 1 ? (
                    <button
                      type="button"
                      className="docs-focus-ring font-medium text-primary hover:underline"
                      onClick={() => go(nav[idx + 1]!.id)}
                    >
                      {nav[idx + 1]!.label} →
                    </button>
                  ) : null}
                </div>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
