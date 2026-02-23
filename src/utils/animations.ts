import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Variants } from 'framer-motion';
import type { AnimationDirection } from '@/types';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// FRAMER MOTION ANIMATION VARIANTS
// ============================================

/**
 * Animation timing constants - used across all animations for consistency
 */
export const ANIMATION_CONFIG = {
  duration: 0.5,
  ease: [0.25, 0.1, 0.25, 1] as const,
  staggerChildren: 0.08,
  delayChildren: 0.05,
} as const;

/**
 * Creates symmetrical animation variants for section transitions
 * Used by all section components for consistent enter/exit animations
 * 
 * @param direction - The direction the element animates from
 * @param distance - The distance in pixels for the animation offset
 * @returns Framer Motion Variants object with hidden and visible states
 */
export const createVariants = (
  direction: AnimationDirection,
  distance = 100
): Variants => {
  const offsets: Record<AnimationDirection, { x: number; y: number }> = {
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
        duration: ANIMATION_CONFIG.duration,
        ease: ANIMATION_CONFIG.ease,
      },
    },
  };
};

/**
 * Container variants for staggered children animations
 * Use this as the parent container to orchestrate child animations
 */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION_CONFIG.staggerChildren,
      delayChildren: ANIMATION_CONFIG.delayChildren,
    },
  },
};

// ============================================
// LEGACY ANIMATION PRESETS (for backwards compatibility)
// ============================================

// Fade in up animation
export const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
};

// Fade in animation
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

// Stagger container
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Text reveal animation
export const textReveal = {
  initial: { y: '100%' },
  animate: {
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

// Scale up animation
export const scaleUp = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
};

// Slide in from left
export const slideInLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
};

// Slide in from right
export const slideInRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
};

// GSAP scroll animation helper
export const createScrollAnimation = (
  element: string | Element,
  animation: gsap.TweenVars,
  triggerOptions?: ScrollTrigger.Vars
) => {
  return gsap.to(element, {
    ...animation,
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      end: 'bottom 20%',
      ...triggerOptions,
    },
  });
};

// GSAP parallax effect
export const createParallax = (
  element: string | Element,
  yPercent: number = -50
) => {
  return gsap.to(element, {
    yPercent,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

// Magnetic button effect
export const magneticEffect = (
  element: HTMLElement,
  strength: number = 0.3
) => {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
};
