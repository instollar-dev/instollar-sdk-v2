import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Button } from './Button';
import { Text } from './Text';
import { SuccessModalIcon } from './SuccessModalIcon';

export interface SuccessModalProps {
  title?: string;
  description?: ReactNode;
  /** Defaults to the green seal checkmark. */
  icon?: ReactNode;
  /** Extra content below the description (replaces the default button when set). */
  children?: ReactNode;
  buttonLabel?: string;
  onButtonClick?: () => void;
  className?: string;
}

const DEFAULT_TITLE = 'Success!';
const DEFAULT_DESCRIPTION = 'Your action completed successfully.';
const DEFAULT_BUTTON_LABEL = 'Okay, thanks!';

/**
 * Centered success panel — use with `useSuccessModal()` / `openModal`, or render
 * as modal content yourself.
 */
export function SuccessModal({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  icon,
  children,
  buttonLabel = DEFAULT_BUTTON_LABEL,
  onButtonClick,
  className,
}: SuccessModalProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 text-center',
        className,
      )}
    >
      <div className="mb-1">{icon ?? <SuccessModalIcon />}</div>

      <Text as="h2" variant="spline-bold-h5" className="text-foreground">
        {title}
      </Text>

      {description ? (
        <Text
          variant="open-regular-p"
          className="max-w-[400px] leading-relaxed text-muted"
        >
          {description}
        </Text>
      ) : null}

      {children ?? (
        <div className="mt-2">
          <Button type="button" variant="primary" onClick={onButtonClick}>
            {buttonLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
