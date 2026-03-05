/**
 * Theme Configuration
 * 
 * Centralized theme tokens and design system constants.
 * These values are the source of truth - ThemeContext consumes them.
 * 
 * @module config/theme
 */

import type { ThemeColors } from '@/types';

// =============================================================================
// COLOR PALETTES
// =============================================================================

/**
 * Dark theme color palette
 * Gold/Silver accent scheme on dark background
 */
export const DARK_COLORS: ThemeColors = {
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
} as const;

/**
 * Light theme color palette
 * Purple/Cyan accent scheme on dark background (modern dark-first design)
 */
export const LIGHT_COLORS: ThemeColors = {
  background: '#0a0a0a',
  backgroundSecondary: '#0f0f12',
  backgroundGradient: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f12 50%, #0a0a0a 100%)',
  text: 'rgba(255, 255, 255, 0.95)',
  textSecondary: 'rgba(255, 255, 255, 0.8)',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  gold: '#a855f7',
  goldMuted: 'rgba(168, 85, 247, 0.7)',
  silver: '#22d3ee',
  border: 'rgba(168, 85, 247, 0.15)',
  borderHover: 'rgba(168, 85, 247, 0.4)',
  cardBg: 'linear-gradient(145deg, rgba(25, 20, 35, 0.8) 0%, rgba(20, 15, 30, 0.6) 100%)',
  cardBgHover: 'linear-gradient(145deg, rgba(168, 85, 247, 0.15) 0%, rgba(34, 211, 238, 0.08) 100%)',
} as const;

// =============================================================================
// DESIGN TOKENS
// =============================================================================

/** Animation timing constants */
export const ANIMATION = {
  DURATION: {
    FAST: 0.3,
    NORMAL: 0.5,
    SLOW: 0.8,
  },
  EASE: {
    DEFAULT: [0.25, 0.1, 0.25, 1] as const,
    SMOOTH: [0.76, 0, 0.24, 1] as const,
    BOUNCE: [0.68, -0.55, 0.265, 1.55] as const,
  },
  STAGGER: {
    FAST: 0.05,
    NORMAL: 0.08,
    SLOW: 0.15,
  },
} as const;

/** Responsive breakpoints (in pixels) */
export const BREAKPOINTS = {
  XS: 360,
  SM: 480,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1512,
  XXXL: 1728,
} as const;

/** Z-index layering system */
export const Z_INDEX = {
  BASE: 0,
  CONTENT: 1,
  OVERLAY: 10,
  SIDEBAR: 100,
  MODAL: 1000,
  CURSOR: 9999,
  LOADING: 99999,
} as const;

/** Spacing scale (in pixels) */
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
  XXXL: 64,
} as const;

