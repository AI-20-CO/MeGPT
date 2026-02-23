/**
 * Theme configuration - centralized color palette
 */

import { ThemeColors } from '@/types';

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
};

export const LIGHT_COLORS: ThemeColors = {
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

// Animation timing constants
export const ANIMATION = {
  DURATION: {
    FAST: 0.3,
    NORMAL: 0.5,
    SLOW: 0.8,
  },
  EASE: {
    DEFAULT: [0.25, 0.1, 0.25, 1],
    SMOOTH: [0.76, 0, 0.24, 1],
    BOUNCE: [0.68, -0.55, 0.265, 1.55],
  },
  STAGGER: {
    FAST: 0.05,
    NORMAL: 0.08,
    SLOW: 0.15,
  },
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

// Z-index layers
export const Z_INDEX = {
  BASE: 0,
  CONTENT: 1,
  OVERLAY: 10,
  SIDEBAR: 100,
  MODAL: 1000,
  CURSOR: 9999,
  LOADING: 99999,
} as const;
