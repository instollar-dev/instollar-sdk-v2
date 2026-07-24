import {
  useEffect,
  useState,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type MouseEventHandler,
} from 'react';
import { cn } from '../utils/cn';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Image URL. When null/empty (or the image fails to load), initials are shown. */
  src?: string | null;
  /** Initials or name used for the fallback label (e.g. `"SA"` or `"Sarah Adams"`). */
  initials: string;
  size?: AvatarSize;
  /** Accessible label for the image; defaults to `initials`. */
  alt?: string;
  /** Forwarded to the underlying `<img>` when `src` is set. */
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>;
  /** When set, Avatar renders as a button. */
  onClick?: MouseEventHandler<HTMLElement>;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'size-8 text-open-regular-tiny',
  md: 'size-10 text-spline-bold-label',
  lg: 'size-12 text-spline-bold-h5',
};

/** Derive up to two uppercase initials from a name or short initials string. */
export function getAvatarInitials(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '?';

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
  }

  return trimmed.slice(0, 2).toUpperCase();
}

function hasImageSrc(src: string | null | undefined): src is string {
  return typeof src === 'string' && src.trim().length > 0;
}

export function Avatar({
  src,
  initials,
  size = 'md',
  alt,
  className,
  imgProps,
  onClick,
  ...props
}: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  const showImage = hasImageSrc(src) && !imageFailed;
  const label = getAvatarInitials(initials);
  const accessibleName = (alt ?? initials.trim()) || label;
  const interactive = typeof onClick === 'function';

  const sharedClassName = cn(
    'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border-0 p-0',
    'bg-destructive text-white font-spline select-none',
    sizeClasses[size],
    interactive &&
      'cursor-pointer transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    className,
  );

  const content = showImage ? (
    <img
      {...imgProps}
      src={src}
      alt={accessibleName}
      className={cn('size-full object-cover', imgProps?.className)}
      onError={(event) => {
        setImageFailed(true);
        imgProps?.onError?.(event);
      }}
    />
  ) : (
    <span aria-hidden>{label}</span>
  );

  if (interactive) {
    return (
      <button
        type="button"
        aria-label={accessibleName}
        className={sharedClassName}
        onClick={onClick}
        {...props}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      role={showImage ? undefined : 'img'}
      aria-label={showImage ? undefined : accessibleName}
      className={sharedClassName}
      {...props}
    >
      {content}
    </div>
  );
}
