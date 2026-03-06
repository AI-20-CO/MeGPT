/**
 * Theme Context Provider
 * 
 * Provides theme state management and color palette access throughout the app.
 * Uses React Context for efficient re-renders only when theme changes.
 * 
 * @module context/ThemeContext
 */

'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { DARK_COLORS, LIGHT_COLORS } from '@/config/theme';
import type { Theme, ThemeColors, ThemeContextType } from '@/types';

// =============================================================================
// CONTEXT SETUP
// =============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

interface ThemeProviderProps {
  readonly children: ReactNode;
}

/**
 * Theme Provider Component
 * Wraps the app to provide theme context to all children.
 * 
 * Features:
 * - Persists theme preference to localStorage
 * - Sets data-theme attribute on document for CSS targeting
 * - Memoized for optimal performance
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      setTheme(savedTheme);
    }
  }, []);

  // Persist theme changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, mounted]);

  // Memoized toggle function
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Memoized colors object
  const colors: ThemeColors = useMemo(
    () => (theme === 'dark' ? DARK_COLORS : LIGHT_COLORS),
    [theme]
  );

  // Memoized context value
  const contextValue = useMemo<ThemeContextType>(
    () => ({ theme, toggleTheme, colors }),
    [theme, toggleTheme, colors]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

/**
 * Custom hook to access theme context
 * @throws Error if used outside of ThemeProvider
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
