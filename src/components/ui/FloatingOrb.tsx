'use client';

import { motion } from 'framer-motion';

export interface FloatingOrbProps {
  /** Animation delay in seconds */
  delay: number;
  /** Animation duration in seconds */
  duration: number;
  /** Size of the orb in pixels */
  size: number;
  /** CSS left position (e.g., '10%', '100px') */
  left: string;
  /** CSS top position (e.g., '20%', '50px') */
  top: string;
  /** Color for the radial gradient */
  color: string;
}

/**
 * Floating animated orb component used for background decoration
 * Creates a subtle floating animation with a blurred radial gradient
 */
export default function FloatingOrb({
  delay,
  duration,
  size,
  left,
  top,
  color,
}: FloatingOrbProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
        y: [0, -30, 0],
        x: [0, 15, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        left,
        top,
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }}
    />
  );
}
