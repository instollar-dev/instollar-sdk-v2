import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemeContextValue,
  type ThemeMode,
} from './types';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: ThemeMode): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme;
}

function readStoredTheme(): ThemeMode | null {
  if (typeof localStorage === 'undefined') return null;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return null;
}

function applyTheme(resolved: ResolvedTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Initial theme when no saved preference exists. Default: `system` */
  defaultTheme?: ThemeMode;
  /** Controlled theme mode */
  theme?: ThemeMode;
  /** Called when theme changes */
  onThemeChange?: (theme: ThemeMode) => void;
  /** Persist choice to localStorage. Default: true */
  persist?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  theme: controlledTheme,
  onThemeChange,
  persist = true,
}: ThemeProviderProps) {
  const [internalTheme, setInternalTheme] = useState<ThemeMode>(
    () => readStoredTheme() ?? defaultTheme,
  );
  const theme = controlledTheme ?? internalTheme;
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(theme));

  const setTheme = useCallback(
    (next: ThemeMode) => {
      if (controlledTheme === undefined) {
        setInternalTheme(next);
      }
      if (persist && typeof localStorage !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      }
      onThemeChange?.(next);
    },
    [controlledTheme, onThemeChange, persist],
  );

  const toggleTheme = useCallback(() => {
    const nextResolved = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(nextResolved);
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const resolved = getSystemTheme();
      setResolvedTheme(resolved);
      applyTheme(resolved);
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

/** Returns resolved theme without throwing when provider is absent */
export function useThemeOptional(): ThemeContextValue | null {
  return useContext(ThemeContext);
}
