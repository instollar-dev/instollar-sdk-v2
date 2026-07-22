import type { ReactNode } from 'react';
import { ArrowDown2, ArrowRight2 } from 'iconsax-react';
import { cn } from '../utils/cn';
import { iconPaint } from '../utils/iconPaint';

export interface SettingsItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  isOpen?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  /** Optional id for aria-controls / header button */
  id?: string;
}

/**
 * Controlled settings accordion row — header always visible; body mounts only when open.
 * Pair with page-owned `openSection` state (single-open accordion).
 */
export function SettingsItem({
  icon,
  title,
  description,
  isOpen = false,
  onClick,
  children,
  className,
  id,
}: SettingsItemProps) {
  const panelId = id ? `${id}-panel` : undefined;
  const headerId = id ? `${id}-header` : undefined;

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-background p-4 transition-shadow md:p-5',
        className,
      )}
    >
      <button
        type="button"
        id={headerId}
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="group flex w-full cursor-pointer items-center justify-between gap-2 border-0 bg-transparent p-0 text-left"
      >
        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          <div
            className={cn(
              'flex size-[50px] shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors md:size-[60px]',
              'group-hover:bg-primary/10 group-hover:text-primary',
            )}
          >
            <div className="scale-90 md:scale-100 [&_svg]:size-7 md:[&_svg]:size-8">{icon}</div>
          </div>
          <div className="min-w-0">
            <h3 className="mb-1 text-open-regular-p font-normal text-foreground md:mb-1.5 md:text-base">
              {title}
            </h3>
            <p className="line-clamp-2 text-open-regular-tiny text-muted md:line-clamp-none md:text-open-regular-label">
              {description}
            </p>
          </div>
        </div>

        <span
          className="shrink-0 text-muted transition-colors group-hover:text-foreground"
          aria-hidden
        >
          {isOpen ? (
            <ArrowDown2 size={20} color={iconPaint.current} variant="Linear" />
          ) : (
            <ArrowRight2 size={20} color={iconPaint.current} variant="Linear" />
          )}
        </span>
      </button>

      {isOpen && children ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          className="mt-5 border-t border-border pt-5 [animation:load-boundary-enter_0.2s_ease-out]"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export default SettingsItem;
