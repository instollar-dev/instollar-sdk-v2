import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import { ArrowDown2, ArrowRight2 } from 'iconsax-react';
import { cn } from '../utils/cn';
import { iconPaint } from '../utils/iconPaint';
import {
  useAccordion,
  type AccordionType,
  type UseAccordionOptions,
} from '../hooks/useAccordion';

type AccordionContextValue = {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error('AccordionItem must be used within Accordion');
  }
  return ctx;
}

export type AccordionProps = UseAccordionOptions & {
  children?: ReactNode;
  className?: string;
  /** Tailwind gap class between items. Default: `gap-3`. */
  gapClassName?: string;
};

export function Accordion({
  children,
  className,
  gapClassName = 'gap-3',
  type = 'single',
  collapsible = true,
  value,
  defaultValue,
  onValueChange,
}: AccordionProps) {
  const accordion = useAccordion({
    type,
    collapsible,
    value,
    defaultValue,
    onValueChange,
  });

  return (
    <AccordionContext.Provider value={accordion}>
      <div className={cn('flex flex-col', gapClassName, className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

export type AccordionItemProps = {
  value: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
  className?: string;
  id?: string;
};

export function AccordionItem({
  value,
  title,
  description,
  icon,
  disabled = false,
  children,
  className,
  id,
}: AccordionItemProps) {
  const { isOpen, toggle } = useAccordionContext();
  const open = isOpen(value);
  const panelId = id ? `${id}-panel` : undefined;
  const headerId = id ? `${id}-header` : undefined;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-background',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      <button
        type="button"
        id={headerId}
        disabled={disabled}
        onClick={() => toggle(value)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 border-0 bg-transparent p-4 text-left md:gap-4 md:p-5"
      >
        {icon ? (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground md:size-12">
            {icon}
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <h3 className="text-open-bold-p text-foreground">{title}</h3>
          {description ? (
            <p className="mt-0.5 text-open-regular-tiny text-muted">{description}</p>
          ) : null}
        </div>
        <span className="shrink-0 text-muted" aria-hidden>
          {open ? (
            <ArrowDown2 size={18} color={iconPaint.current} variant="Linear" />
          ) : (
            <ArrowRight2 size={18} color={iconPaint.current} variant="Linear" />
          )}
        </span>
      </button>

      {open && children != null ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          className="border-t border-border px-4 pb-4 pt-4 md:px-5 md:pb-5 md:pt-5 [animation:load-boundary-enter_0.2s_ease-out]"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export { useAccordion, type AccordionType, type UseAccordionOptions };
