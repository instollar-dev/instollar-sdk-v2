import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Appearance, type ColorSchemeName } from 'react-native';
import {
  getThemeColors,
  nativeFonts,
  type ColorScheme,
  type ThemeColors,
} from '@instollar-dev/instollar-tokens';

export type ThemeMode = 'light' | 'dark' | 'system';

export type InstollarTheme = {
  scheme: ColorScheme;
  colors: ThemeColors;
  fonts: typeof nativeFonts;
};

type ThemeContextValue = InstollarTheme & {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveScheme(mode: ThemeMode, system: ColorSchemeName): ColorScheme {
  if (mode === 'system') {
    return system === 'dark' ? 'dark' : 'light';
  }
  return mode;
}

export type ThemeProviderProps = {
  children: ReactNode;
  /** Default `system` — follows device Appearance. */
  mode?: ThemeMode;
  onModeChange?: (mode: ThemeMode) => void;
};

export function ThemeProvider({
  children,
  mode: controlledMode,
  onModeChange,
}: ThemeProviderProps) {
  const [uncontrolledMode, setUncontrolledMode] = useState<ThemeMode>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
    () => Appearance.getColorScheme() ?? 'light',
  );

  const mode = controlledMode ?? uncontrolledMode;

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => sub.remove();
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const scheme = resolveScheme(mode, systemScheme);
    return {
      mode,
      setMode: (next) => {
        onModeChange?.(next);
        if (controlledMode === undefined) setUncontrolledMode(next);
      },
      scheme,
      colors: getThemeColors(scheme),
      fonts: nativeFonts,
    };
  }, [mode, systemScheme, controlledMode, onModeChange]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('[instollar-react-native] useTheme must be used within ThemeProvider');
  }
  return ctx;
}

/** Safe theme access with light defaults when no provider is mounted. */
export function useThemeColors(): ThemeColors {
  const ctx = useContext(ThemeContext);
  return ctx?.colors ?? getThemeColors('light');
}
