import {
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import {
  getRelativePath,
  getRouteTargetPath,
  matchesRelativePath,
  type RouteSegmentAdapter,
} from '../utils/routeSegmentMatch';

export type SegmentsRouterAdapter = RouteSegmentAdapter;

export interface SegmentOption {
  value: string;
  label: ReactNode;
  /** Optional leading icon (e.g. `<Icon icon={Element3} size="sm" />`). */
  icon?: ReactNode;
  disabled?: boolean;
  /** Route segment for router mode. `""` means the basePath itself. */
  path?: string;
}

export interface SegmentsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  options: SegmentOption[];
  /** Controlled selected value. Ignored when `useRoutes` is active. */
  value?: string;
  /** Uncontrolled initial value. Also used to redirect the index route in router mode. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md';
  /** Router mode — selected segment derives from URL and clicks navigate. */
  useRoutes?: boolean;
  basePath?: string;
  /** REQUIRED when useRoutes is true. */
  router?: RouteSegmentAdapter;
}

const sizeClasses = {
  sm: {
    track: 'gap-0.5 p-0.5',
    segment: 'gap-1.5 px-2.5 py-1 text-open-regular-tiny',
  },
  md: {
    track: 'gap-1 p-1',
    segment: 'gap-2 px-3.5 py-1.5 text-open-regular-label',
  },
} as const;

export function Segments({
  options,
  value,
  defaultValue,
  onChange,
  size = 'md',
  className,
  id,
  useRoutes = false,
  basePath,
  router,
  ...props
}: SegmentsProps) {
  const reactId = useId();
  const groupId = id ?? `segments-${reactId}`;
  const isRouterMode = useRoutes && !!basePath && !!router;
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(
    () => defaultValue ?? options[0]?.value ?? '',
  );

  const routerRelativePath = isRouterMode
    ? getRelativePath(router.pathname, basePath)
    : null;
  const routerMatchedValue =
    isRouterMode && routerRelativePath !== null
      ? options.find((option) => matchesRelativePath(option, routerRelativePath))?.value
      : undefined;

  const selected = isRouterMode
    ? (routerMatchedValue ?? '')
    : isControlled
      ? value
      : internalValue;

  const lastNotifiedRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!isRouterMode) return;
    if (routerMatchedValue !== undefined) {
      if (lastNotifiedRef.current !== routerMatchedValue) {
        lastNotifiedRef.current = routerMatchedValue;
        onChange?.(routerMatchedValue);
      }
      return;
    }
    if (routerRelativePath === '' && defaultValue) {
      const defaultOption = options.find((option) => option.value === defaultValue);
      if (defaultOption) {
        router.navigate(getRouteTargetPath(defaultOption, basePath), { replace: true });
      }
    }
  }, [
    isRouterMode,
    routerMatchedValue,
    routerRelativePath,
    defaultValue,
    options,
    onChange,
    router,
    basePath,
  ]);

  function select(option: SegmentOption) {
    if (option.disabled) return;

    if (isRouterMode) {
      router.navigate(getRouteTargetPath(option, basePath), { replace: true });
      return;
    }

    if (option.value === selected) return;

    if (!isControlled) setInternalValue(option.value);
    onChange?.(option.value);
  }

  const sizing = sizeClasses[size];

  return (
    <div className={cn('max-w-full overflow-x-auto', className)} {...props}>
      <div
        role="radiogroup"
        id={groupId}
        className={cn(
          'inline-flex w-max max-w-none items-center rounded-full border border-border',
          'bg-[color-mix(in_srgb,var(--color-border)_55%,var(--color-bg))]',
          sizing.track,
        )}
      >
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={option.disabled}
              onClick={() => select(option)}
              className={cn(
                'inline-flex shrink-0 items-center justify-center rounded-full font-spline outline-none transition-all duration-150',
                'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                'disabled:cursor-not-allowed disabled:opacity-50',
                sizing.segment,
                isSelected
                  ? 'bg-background text-brand shadow-sm'
                  : 'bg-transparent text-muted hover:text-foreground',
              )}
            >
              {option.icon ? (
                <span
                  className={cn(
                    'inline-flex shrink-0 items-center [&_svg]:text-current',
                    isSelected ? 'text-brand' : 'text-muted',
                  )}
                  aria-hidden
                >
                  {option.icon}
                </span>
              ) : null}
              <span className="whitespace-nowrap">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
