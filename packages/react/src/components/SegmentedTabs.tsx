import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../utils/cn';
import {
  getSegmentedTabBadgeClasses,
  getSegmentedTabStateClasses,
  segmentedTabBaseClasses,
  segmentedTabSizeClasses,
  segmentedTabsTrackClasses,
  type SegmentedTabsAccent,
  type SegmentedTabsSize,
} from './segmentedTabsVariants';

export type { SegmentedTabsAccent, SegmentedTabsSize };

interface SegmentedTabsContextValue {
  value: string;
  onSelect: (value: string) => void;
  accent: SegmentedTabsAccent;
  size: SegmentedTabsSize;
  tabListId: string;
}

const SegmentedTabsContext = createContext<SegmentedTabsContextValue | null>(null);

function useSegmentedTabsContext(component: string) {
  const ctx = useContext(SegmentedTabsContext);
  if (!ctx) {
    throw new Error(`${component} must be used within SegmentedTabs`);
  }
  return ctx;
}

export interface SegmentedTabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  accent?: SegmentedTabsAccent;
  size?: SegmentedTabsSize;
  className?: string;
  children: ReactNode;
}

export function SegmentedTabs({
  value: valueProp,
  defaultValue,
  onValueChange,
  accent = 'adaptive',
  size = 'default',
  className,
  children,
}: SegmentedTabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolledValue;
  const tabListId = useId();
  const tabListRef = useRef<HTMLDivElement>(null);

  const onSelect = useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const getEnabledTabs = useCallback(() => {
    if (!tabListRef.current) return [];
    return Array.from(
      tabListRef.current.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
    );
  }, []);

  const focusTabAt = useCallback(
    (index: number) => {
      const tabs = getEnabledTabs();
      if (tabs.length === 0) return;
      const wrappedIndex = ((index % tabs.length) + tabs.length) % tabs.length;
      const tab = tabs[wrappedIndex];
      tab.focus();
      const nextValue = tab.getAttribute('data-value');
      if (nextValue) {
        onSelect(nextValue);
      }
    },
    [getEnabledTabs, onSelect],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const tabs = getEnabledTabs();
      if (tabs.length === 0) return;

      const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
      const resolvedIndex =
        currentIndex === -1 ? tabs.findIndex((tab) => tab.dataset.value === value) : currentIndex;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          focusTabAt(resolvedIndex + 1);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          focusTabAt(resolvedIndex - 1);
          break;
        case 'Home':
          event.preventDefault();
          focusTabAt(0);
          break;
        case 'End':
          event.preventDefault();
          focusTabAt(tabs.length - 1);
          break;
        default:
          break;
      }
    },
    [focusTabAt, getEnabledTabs, value],
  );

  return (
    <SegmentedTabsContext.Provider value={{ value, onSelect, accent, size, tabListId }}>
      <div
        ref={tabListRef}
        id={tabListId}
        role="tablist"
        className={cn(segmentedTabsTrackClasses, className)}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </SegmentedTabsContext.Provider>
  );
}

export interface SegmentedTabProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'prefix' | 'value'> {
  value: string;
  badge?: number | string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export function SegmentedTab({
  value: tabValue,
  badge,
  prefix,
  suffix,
  disabled,
  className,
  children,
  onClick,
  ...props
}: SegmentedTabProps) {
  const { value, onSelect, accent, size } = useSegmentedTabsContext('SegmentedTab');
  const selected = value === tabValue;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented && !disabled) {
      onSelect(tabValue);
    }
  };

  return (
    <button
      type="button"
      role="tab"
      data-value={tabValue}
      aria-selected={selected}
      disabled={disabled}
      tabIndex={selected ? 0 : -1}
      className={cn(
        segmentedTabBaseClasses,
        segmentedTabSizeClasses[size],
        getSegmentedTabStateClasses(selected, accent),
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {prefix ? <span className="inline-flex shrink-0 items-center">{prefix}</span> : null}
      <span className="truncate">{children}</span>
      {badge !== undefined ? (
        <span className={getSegmentedTabBadgeClasses(selected, accent)}>{badge}</span>
      ) : null}
      {suffix ? <span className="inline-flex shrink-0 items-center">{suffix}</span> : null}
    </button>
  );
}
