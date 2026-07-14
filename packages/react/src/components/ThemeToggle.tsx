import { Moon, Sun } from 'iconsax-react';
import { useTheme } from '../theme/ThemeProvider';
import { cn } from '../utils/cn';

export interface ThemeToggleProps {
  className?: string;
  /** Show text label beside the icon */
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md p-2 outline-none',
        'cursor-pointer hover:cursor-pointer disabled:cursor-not-allowed disabled:hover:cursor-not-allowed',
        'text-foreground hover:bg-primary/6 dark:hover:bg-white/8',
        'transition-colors duration-200',
        className,
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun size={20} variant="Linear" aria-hidden /> : <Moon size={20} variant="Linear" aria-hidden />}
      {showLabel ? (
        <span className="text-open-regular-label font-semibold">{isDark ? 'Light' : 'Dark'}</span>
      ) : null}
    </button>
  );
}
