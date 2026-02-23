/**
 * Global type definitions for the portfolio application
 */

// Theme types
export type Theme = 'dark' | 'light';

export interface ThemeColors {
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
}

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
}

// Animation types
export type AnimationDirection = 'left' | 'right' | 'top' | 'bottom' | 'center';

export interface AnimationOffset {
  x: number;
  y: number;
}

// Section types
export interface SectionState {
  isActive: boolean;
  isEntering: boolean;
  isLeaving: boolean;
  direction: 'up' | 'down' | null;
}

// Component prop types
export interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

// Data types
export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  title: string;
  color: string;
  skills: Skill[];
}

export interface TechnologyGroup {
  category: string;
  color: string;
  techs: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string[];
  skills: string[];
}

export interface Project {
  title: string;
  description: string;
  tech: string[];
  category: string;
  highlight?: string;
  links: {
    github?: string;
    live?: string;
  };
}

export interface ContactLink {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}
