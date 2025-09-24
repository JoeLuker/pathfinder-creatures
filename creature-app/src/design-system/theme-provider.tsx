import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { themes, type Theme, type ThemeConfig } from './tokens';

interface ThemeContextValue {
  theme: Theme;
  themeConfig: ThemeConfig;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  systemPreference: Theme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'pathfinder-theme',
}: ThemeProviderProps) {
  // Detect system preference
  const getSystemPreference = (): Theme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [systemPreference, setSystemPreference] = useState<Theme>(getSystemPreference);

  // Initialize theme from localStorage or system preference
  const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return defaultTheme;

    const stored = localStorage.getItem(storageKey) as Theme;
    if (stored && stored in themes) return stored;

    return systemPreference;
  };

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newPreference = e.matches ? 'dark' : 'light';
      setSystemPreference(newPreference);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // Add current theme class
    root.classList.add(theme);

    // Apply CSS custom properties with proper naming
    const themeConfig = themes[theme];

    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      // Set semantic properties
      root.style.setProperty(`--${key}`, value);
    });

    // Save to localStorage
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const setTheme = (newTheme: Theme) => {
    if (newTheme in themes) {
      setThemeState(newTheme);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextValue = {
    theme,
    themeConfig: themes[theme],
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    systemPreference,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme context
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Utility hook for theme-aware styling
export function useThemeAware() {
  const { theme, isDark, themeConfig } = useTheme();

  return {
    theme,
    isDark,
    isLight: !isDark,
    colors: themeConfig.colors,

    // Helper functions for conditional styling
    when: (condition: boolean, trueValue: string, falseValue: string = '') =>
      condition ? trueValue : falseValue,

    ifDark: (darkValue: string, lightValue: string = '') =>
      isDark ? darkValue : lightValue,

    ifLight: (lightValue: string, darkValue: string = '') =>
      isDark ? darkValue : lightValue,
  };
}