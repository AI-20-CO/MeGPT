'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function FluidCursor() {
  const { theme } = useTheme();
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Inner cursor - fast follow
  const springConfigFast = { damping: 30, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfigFast);
  const cursorY = useSpring(mouseY, springConfigFast);
  
  // Outer cursor - slow follow for fluid effect
  const springConfigSlow = { damping: 20, stiffness: 150, mass: 1 };
  const cursorOuterX = useSpring(mouseX, springConfigSlow);
  const cursorOuterY = useSpring(mouseY, springConfigSlow);

  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);
  const outerScale = useSpring(1, { damping: 20, stiffness: 300 });
  const outerOpacity = useSpring(0.5, { damping: 20, stiffness: 300 });

  useEffect(() => {
    // Check for touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let velocityX = 0;
    let velocityY = 0;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate velocity for squish effect
      velocityX = e.clientX - lastX;
      velocityY = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Squish effect based on velocity
      const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
      const maxSquish = 0.3;
      const squish = Math.min(speed / 50, maxSquish);
      
      if (speed > 2) {
        const angle = Math.atan2(velocityY, velocityX);
        scaleX.set(1 + squish * Math.abs(Math.cos(angle)));
        scaleY.set(1 + squish * Math.abs(Math.sin(angle)));
      } else {
        scaleX.set(1);
        scaleY.set(1);
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('interactive');

      if (isInteractive) {
        outerScale.set(2);
        outerOpacity.set(0.2);
      }
    };

    const handleMouseLeave = () => {
      outerScale.set(1);
      outerOpacity.set(0.5);
    };

    const handleMouseDown = () => {
      outerScale.set(0.8);
    };

    const handleMouseUp = () => {
      outerScale.set(1);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY, scaleX, scaleY, outerScale, outerOpacity]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Inner dot cursor */}
      <motion.div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      >
        <motion.div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: theme === 'dark' ? '#fff' : '#1a1a1a',
            scaleX,
            scaleY,
          }}
        />
      </motion.div>

      {/* Outer ring cursor - follows with delay */}
      <motion.div
        ref={cursorOuterRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: cursorOuterX,
          y: cursorOuterY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 9998,
          scale: outerScale,
          opacity: outerOpacity,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: theme === 'dark' 
              ? '1px solid rgba(255, 255, 255, 0.5)' 
              : '1px solid rgba(0, 0, 0, 0.3)',
            background: theme === 'dark' 
              ? 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Trail particles */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: cursorOuterX,
          y: cursorOuterY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 9997,
        }}
      >
        <motion.div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: theme === 'dark' 
              ? 'radial-gradient(circle, rgba(192,192,192,0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(0,0,0,0.05) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </>
  );
}
