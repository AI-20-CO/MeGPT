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

/** Animation offset coordinates */
export interface AnimationOffset {
  readonly x: number;
  readonly y: number;
}

// =============================================================================
// DATA MODELS
// =============================================================================

/** Individual skill with proficiency level */
export interface Skill {
  readonly name: string;
  readonly level: number;
}

/** Skill category grouping related skills */
export interface SkillCategory {
  readonly title: string;
  readonly color: string;
  readonly skills: readonly Skill[];
}

/** Technology group for display purposes */
export interface TechnologyGroup {
  readonly category: string;
  readonly color: string;
  readonly techs: readonly string[];
}

/** Work experience entry */
export interface Experience {
  readonly role: string;
  readonly company: string;
  readonly period: string;
  readonly location: string;
  readonly description: readonly string[];
  readonly skills: readonly string[];
}

/** Project portfolio entry */
export interface Project {
  readonly title: string;
  readonly description: string;
  readonly tech: readonly string[];
  readonly category: string;
  readonly highlight?: string;
  readonly links: {
    readonly github?: string;
    readonly live?: string;
  };
}

/** Contact link with icon */
export interface ContactLink {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly value: string;
  readonly href: string;
}

/** Navigation item */
export interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly icon: React.ReactNode;
}
