import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import { iconPaint } from '../utils/iconPaint';

export interface TabModel {
  label: ReactNode;
  value: string;
  /** Optional — omit on every tab for header-only usage. Functions are called lazily for the active tab only. */
  content?: ReactNode | (() => ReactNode);
  /** Route segment for router mode. `""` means the basePath itself. */
  path?: string;
}

/** Alias kept for painless find/replace when migrating old `TabsV2` call sites. */
export type TabV2Model = TabModel;

export interface TabsRouterAdapter {
  /** Current location.pathname */
  pathname: string;
  navigate: (path: string, opts?: { replace?: boolean }) => void;
}

export interface TabsProps {
  /** Rich models, or plain strings (each string becomes value AND label). */
  tabs: TabModel[] | string[];
  /** Controlled mode: when set, the component never manages active state itself. */
  activeTab?: string;
  /** Uncontrolled initial tab. Ignored when activeTab is set. */
  defaultTab?: string;
  onTabChange?: (value: string) => void;
  /** Merged into the scrollable header strip. */
  className?: string;
  contentClassName?: string;
  /** Default false; true = tabs share width evenly. */
  fullWidth?: boolean;
  /** Active underline color; default "green" (#002816), "yellow" = accent. */
  variant?: 'yellow' | 'green';
  /** Rendered after the tab strip (right side). */
  trailing?: ReactNode;
  /** Rendered between headers and content. */
  betweenContent?: ReactNode;
  /** Router mode — active tab derives from URL and clicks navigate. */
  useRoutes?: boolean;
  basePath?: string;
  /** REQUIRED when useRoutes is true. */
  router?: TabsRouterAdapter;
}

function normalizeTabs(tabs: TabModel[] | string[]): TabModel[] {
  return tabs.map((tab) =>
    typeof tab === 'string' ? { label: tab, value: tab } : tab,
  );
}

function normalizeBasePath(basePath: string): string {
  return basePath.replace(/\/+$/, '');
}

/** Pathname relative to basePath, or null when the pathname is outside basePath entirely. */
function getRelativePath(pathname: string, basePath: string): string | null {
  const base = normalizeBasePath(basePath);
  if (pathname === base) return '';
  if (pathname.startsWith(`${base}/`)) return pathname.slice(base.length).replace(/^\/+/, '');
  return null;
}

function matchesRelativePath(tab: TabModel, relativePath: string): boolean {
  if (tab.path === undefined) return tab.value === relativePath;
  if (tab.path === '') return relativePath === '';
  return relativePath === tab.path || relativePath.startsWith(`${tab.path}/`);
}

function getTabTargetPath(tab: TabModel, basePath: string): string {
  const base = normalizeBasePath(basePath);
  const segment = tab.path ?? tab.value;
  return segment === '' ? base : `${base}/${segment}`;
}

const SCROLL_EDGE_THRESHOLD = 5;

export function Tabs({
  tabs,
  activeTab,
  defaultTab,
  onTabChange,
  className,
  contentClassName,
  fullWidth = false,
  variant = 'green',
  trailing,
  betweenContent,
  useRoutes = false,
  basePath,
  router,
}: TabsProps) {
  const normalizedTabs = useMemo(() => normalizeTabs(tabs), [tabs]);
  const isRouterMode = useRoutes && !!basePath && !!router;

  const [internalActive, setInternalActive] = useState(
    () => defaultTab ?? normalizedTabs[0]?.value ?? '',
  );

  const routerRelativePath = isRouterMode
    ? getRelativePath(router.pathname, basePath)
    : null;
  const routerMatchedValue =
    isRouterMode && routerRelativePath !== null
      ? normalizedTabs.find((tab) => matchesRelativePath(tab, routerRelativePath))?.value
      : undefined;

  const active = isRouterMode
    ? routerMatchedValue ?? ''
    : activeTab !== undefined
      ? activeTab
      : internalActive;

  // Router mode: notify on URL-derived matches; redirect index path to defaultTab.
  const lastNotifiedRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!isRouterMode) return;
    if (routerMatchedValue !== undefined) {
      if (lastNotifiedRef.current !== routerMatchedValue) {
        lastNotifiedRef.current = routerMatchedValue;
        onTabChange?.(routerMatchedValue);
      }
      return;
    }
    if (routerRelativePath === '' && defaultTab) {
      const defaultModel = normalizedTabs.find((tab) => tab.value === defaultTab);
      if (defaultModel) {
        router.navigate(getTabTargetPath(defaultModel, basePath), { replace: true });
      }
    }
  }, [
    isRouterMode,
    routerMatchedValue,
    routerRelativePath,
    defaultTab,
    normalizedTabs,
    onTabChange,
    router,
    basePath,
  ]);

  // Uncontrolled mode fires onTabChange once on mount with the initial value
  // (the old component did; call sites rely on it).
  const firedInitialRef = useRef(false);
  useEffect(() => {
    if (firedInitialRef.current) return;
    firedInitialRef.current = true;
    if (isRouterMode || activeTab !== undefined) return;
    if (internalActive) onTabChange?.(internalActive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabClick = (tab: TabModel) => {
    if (isRouterMode) {
      // Tab switches must not create history entries.
      router.navigate(getTabTargetPath(tab, basePath), { replace: true });
      return;
    }
    if (activeTab !== undefined) {
      onTabChange?.(tab.value);
      return;
    }
    setInternalActive(tab.value);
    onTabChange?.(tab.value);
  };

  // Overflow affordances -----------------------------------------------------
  const stripRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > SCROLL_EDGE_THRESHOLD);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - SCROLL_EDGE_THRESHOLD);
  }, []);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    let observer: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateArrows);
      observer.observe(el);
      if (el.firstElementChild) observer.observe(el.firstElementChild);
    }
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
      observer?.disconnect();
    };
  }, [updateArrows, normalizedTabs.length]);

  useEffect(() => {
    const el = stripRef.current;
    if (!el || !active) return;
    const activeButton = el.querySelector<HTMLElement>('[data-active="true"]');
    if (activeButton) {
      // Scroll the strip horizontally only — never the page.
      // scrollIntoView would drag long docs (e.g. the Style Guide) down to the Tabs section on mount.
      const nextLeft = Math.max(
        0,
        activeButton.offsetLeft - (el.clientWidth - activeButton.offsetWidth) / 2,
      );
      if (typeof el.scrollTo === 'function') {
        el.scrollTo({ left: nextLeft, behavior: 'smooth' });
      } else {
        el.scrollLeft = nextLeft;
      }
    }
    const timer = setTimeout(updateArrows, 300);
    return () => clearTimeout(timer);
  }, [active, updateArrows]);

  const scrollStrip = (direction: -1 | 1) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: 'smooth' });
  };

  // Content ------------------------------------------------------------------
  const activeModel = normalizedTabs.find((tab) => tab.value === active);
  const activeContent =
    typeof activeModel?.content === 'function' ? activeModel.content() : activeModel?.content;

  const activeBarColor =
    variant === 'green'
      ? 'bg-[var(--sdk-tabs-active,#002816)]'
      : 'bg-secondary';

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          {canScrollLeft && (
            <>
              <div
                className="pointer-events-none absolute inset-y-0 left-0 z-5 w-10 bg-linear-to-r from-background to-transparent"
                aria-hidden
              />
              <button
                type="button"
                aria-label="Scroll tabs left"
                onClick={() => scrollStrip(-1)}
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-background p-1 shadow-md transition-colors hover:bg-foreground/5"
              >
                <ArrowLeft2 size={16} color={iconPaint.foreground} aria-hidden />
              </button>
            </>
          )}
          <div
            ref={stripRef}
            role="tablist"
            className={cn(
              'flex gap-5 overflow-x-auto scroll-smooth md:gap-8',
              'scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
              fullWidth && 'w-full justify-between',
              className,
            )}
          >
            {normalizedTabs.map((tab) => {
              const isActive = tab.value === active;
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  data-active={isActive ? 'true' : undefined}
                  onClick={() => handleTabClick(tab)}
                  className={cn(
                    'relative shrink-0 cursor-pointer whitespace-nowrap px-3 pb-3 text-sm transition-colors duration-200 md:text-base',
                    isActive
                      ? 'font-medium text-foreground'
                      : 'text-muted hover:text-foreground',
                    fullWidth && 'flex-1',
                  )}
                >
                  {tab.label}
                  <span
                    aria-hidden
                    className={cn(
                      'absolute bottom-0 left-0 right-0 h-1.5 rounded-t-lg transition-colors duration-200',
                      isActive ? activeBarColor : 'bg-border',
                    )}
                  />
                </button>
              );
            })}
          </div>
          {canScrollRight && (
            <>
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-5 w-10 bg-linear-to-l from-background to-transparent"
                aria-hidden
              />
              <button
                type="button"
                aria-label="Scroll tabs right"
                onClick={() => scrollStrip(1)}
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-background p-1 shadow-md transition-colors hover:bg-foreground/5"
              >
                <ArrowRight2 size={16} color={iconPaint.foreground} aria-hidden />
              </button>
            </>
          )}
        </div>
        {trailing ? <div className="shrink-0 lg:ml-auto">{trailing}</div> : null}
      </div>

      {betweenContent ? <div>{betweenContent}</div> : null}

      {activeContent != null ? (
        <div className={cn('w-full min-w-0', contentClassName)}>{activeContent}</div>
      ) : null}
    </div>
  );
}

export default Tabs;
