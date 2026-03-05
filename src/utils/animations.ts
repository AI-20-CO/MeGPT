/**
 * Animation Utilities
 * 
 * Centralized animation configuration and Framer Motion variants.
 * Following FAANG best practices for consistent, performant animations.
 * 
 * @module utils/animations
 */

import type { Variants } from 'framer-motion';
import type { AnimationDirection } from '@/types';

// =============================================================================
// ANIMATION CONFIGURATION
// =============================================================================

/**
 * Global animation timing constants
 * Used across all animations for consistency and easy tuning
 */
export const ANIMATION_CONFIG = {
  /** Duration values in seconds */
  duration: {
    fast: 0.3,
    normal: 0.5,
    slow: 0.8,
  },
  /** Cubic bezier easing curves */
  ease: {
    default: [0.25, 0.1, 0.25, 1] as const,
    smooth: [0.76, 0, 0.24, 1] as const,
    bounce: [0.68, -0.55, 0.265, 1.55] as const,
  },
  /** Stagger timing for lists */
  stagger: {
    fast: 0.05,
    normal: 0.08,
    slow: 0.15,
  },
} as const;

// =============================================================================
// FRAMER MOTION VARIANTS
// =============================================================================

/**
 * Creates symmetrical animation variants for section transitions
 * 
 * @param direction - The direction the element animates from
 * @param distance - The distance in pixels for the animation offset
 * @returns Framer Motion Variants object with hidden and visible states
 * 
 * @example
 * ```tsx
 * <motion.div variants={createVariants('left', 80)} initial="hidden" animate="visible">
 *   Content
 * </motion.div>
 * ```
 */
export const createVariants = (
  direction: AnimationDirection,
  distance = 100
): Variants => {
  const offsets: Readonly<Record<AnimationDirection, { x: number; y: number }>> = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    top: { x: 0, y: -distance },
    bottom: { x: 0, y: distance },
    center: { x: 0, y: 0 },
  };

  const offset = offsets[direction];

  return {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
      scale: direction === 'center' ? 0.85 : 0.95,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: ANIMATION_CONFIG.duration.normal,
        ease: ANIMATION_CONFIG.ease.default,
      },
    },
  };
};

/**
 * Container variants for orchestrating staggered children animations
 * 
 * @example
 * ```tsx
 * <motion.div variants={containerVariants} initial="hidden" animate="visible">
 *   {items.map(item => (
 *     <motion.div key={item.id} variants={createVariants('bottom')}>
 *       {item.content}
 *     </motion.div>
 *   ))}
 * </motion.div>
 * ```
 */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger.normal,
      delayChildren: ANIMATION_CONFIG.stagger.fast,
    },
  },
};

// =============================================================================
// PRESET VARIANTS (for common use cases)
// =============================================================================

/** Fade in with upward movement */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_CONFIG.duration.slow,
      ease: ANIMATION_CONFIG.ease.smooth,
    },
  },
};

/** Simple fade in */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/** Scale up with fade */
export const scaleUp: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: ANIMATION_CONFIG.ease.smooth,
    },
  },
};

/** Slide in from left */
export const slideInLeft: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: ANIMATION_CONFIG.duration.slow,
      ease: ANIMATION_CONFIG.ease.smooth,
    },
  },
};

/** Slide in from right */
export const slideInRight: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: ANIMATION_CONFIG.duration.slow,
      ease: ANIMATION_CONFIG.ease.smooth,
    },
  },
};

