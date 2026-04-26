/**
 * Global Type Definitions
 * 
 * Centralized TypeScript types for the portfolio application.
 * Following FAANG best practices for type organization and documentation.
 * 
 * @module types
 */

// =============================================================================
// THEME TYPES
// =============================================================================

/** Available theme modes */
export type Theme = 'dark' | 'light';

/** Color palette structure used by both themes */
export interface ThemeColors {
  readonly background: string;
  readonly backgroundSecondary: string;
  readonly backgroundGradient: string;
  readonly text: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly gold: string;
  readonly goldMuted: string;
  readonly silver: string;
  readonly border: string;
  readonly borderHover: string;
  readonly cardBg: string;
  readonly cardBgHover: string;
}

/** Theme context interface for React context */
export interface ThemeContextType {
  readonly theme: Theme;
  readonly toggleTheme: () => void;
  readonly colors: ThemeColors;
}

// =============================================================================
// ANIMATION TYPES
// =============================================================================

/** Supported animation directions for section transitions */
export type AnimationDirection = 'left' | 'right' | 'top' | 'bottom' | 'center';
