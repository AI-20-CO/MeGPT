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

// ANIMATION CONFIGURATION

/**
 * Global animation timing constants
 * Used across all animations for consistency and easy tuning
 */
export const ANIMATION_CONFIG = {
  /** Duration values in seconds */
  duration: {
    fast: 0.25,
    normal: 0.4,
    slow: 0.6,
  },
  /** Cubic bezier easing curves - optimized for smoothness */
  ease: {
    default: [0.22, 1, 0.36, 1] as const, // Smooth ease-out
    smooth: [0.4, 0, 0.2, 1] as const,
    bounce: [0.68, -0.3, 0.265, 1.35] as const,
  },
  /** Stagger timing for lists - faster for snappier feel */
  stagger: {
    fast: 0.03,
    normal: 0.05,
    slow: 0.08,
  },
} as const;

// FRAMER MOTION VARIANTS

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
      scale: direction === 'center' ? 0.9 : 0.97,
      filter: 'blur(4px)', // Reduced from 10px for performance
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1], // Smoother organic ease-out
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

// SECTION VIEWPORT ANIMATIONS

/**
 * Section animation variants for scroll-triggered fade/slide effects
 * Animates in when entering viewport, out when leaving
 * Uses smooth organic easing for aesthetically pleasing transitions
 */
export const sectionViewportVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.97,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // More organic ease-out curve
    },
  },
};

/** Section viewport animation configuration */
export const sectionViewportConfig = {
  amount: 0.2 as const,
  margin: '-80px' as const,
};
