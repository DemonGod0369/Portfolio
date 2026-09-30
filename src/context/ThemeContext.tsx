import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getThemeFromCookie(): Theme | null {
  try {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/(?:^|; )gunjan_theme=([^;]*)/);
    if (match && (match[1] === 'dark' || match[1] === 'light')) {
      return match[1] as Theme;
    }
  } catch {
    // ignore
  }
  return null;
}

function setThemeCookie(theme: Theme) {
  try {
    if (typeof document !== 'undefined') {
      document.cookie = `gunjan_theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
    }
  } catch {
    // ignore
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const cookieTheme = getThemeFromCookie();
    if (cookieTheme) return cookieTheme;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    setThemeCookie(theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    } else {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
