import { createContext, useContext, useEffect, useState } from "react";

export const AVAILABLE_THEMES = {
  system: {
    id: "system",
    label: "System Default",
    isDark: false, // Determined dynamically at runtime via matchMedia
  },
  default: {
    id: "default",
    label: "Warm Sunset",
    isDark: true,
  },
  dark: {
    id: "dark",
    label: "Deep Charcoal Navy",
    isDark: true,
  },
  ocean: {
    id: "ocean",
    label: "Ocean Breeze",
    isDark: true,
  },
} as const;

export type Theme = keyof typeof AVAILABLE_THEMES;

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "weegee-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;

    let activeTheme = theme;
    if (theme === "system") {
      activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "default";
    }

    root.setAttribute("data-theme", activeTheme);

    if (AVAILABLE_THEMES[activeTheme]?.isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
