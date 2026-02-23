'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    backgroundSecondary: string;
    backgroundGradient: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    gold: string;
    goldMuted: string;
    silver: string;
    border: string;
    borderHover: string;
    cardBg: string;
    cardBgHover: string;
  };
}

const darkColors = {
  background: '#0a0a0a',
  backgroundSecondary: '#0f0f0f',
  backgroundGradient: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 50%, #0a0a0a 100%)',
  text: 'rgba(255, 255, 255, 0.9)',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  gold: '#c4a35a',
  goldMuted: 'rgba(196, 163, 90, 0.6)',
  silver: '#c0c0c0',
  border: 'rgba(255, 255, 255, 0.05)',
  borderHover: 'rgba(196, 163, 90, 0.3)',
  cardBg: 'linear-gradient(145deg, rgba(30, 30, 35, 0.6) 0%, rgba(25, 25, 30, 0.4) 100%)',
  cardBgHover: 'linear-gradient(145deg, rgba(196, 163, 90, 0.08) 0%, rgba(192, 192, 192, 0.04) 100%)',
};

const lightColors = {
  background: '#fafafa',
  backgroundSecondary: '#f5f5f5',
  backgroundGradient: 'linear-gradient(180deg, #fafafa 0%, #f0f0f0 50%, #fafafa 100%)',
  text: 'rgba(20, 20, 20, 0.95)',
  textSecondary: 'rgba(30, 30, 30, 0.8)',
  textMuted: 'rgba(60, 60, 60, 0.6)',
  gold: '#0d9488',  // Teal/cyan accent color
  goldMuted: 'rgba(13, 148, 136, 0.7)',
  silver: '#5b7a78',  // Muted teal
  border: 'rgba(0, 0, 0, 0.08)',
  borderHover: 'rgba(13, 148, 136, 0.4)',
  cardBg: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(245, 245, 245, 0.8) 100%)',
  cardBgHover: 'linear-gradient(145deg, rgba(13, 148, 136, 0.08) 0%, rgba(200, 200, 200, 0.1) 100%)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
