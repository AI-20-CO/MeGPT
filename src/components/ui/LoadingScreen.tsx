'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Animate progress from 0 to 100
    const duration = 1500; // 1.5 seconds total
    const steps = 100;
    const stepDuration = duration / steps;

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        // Small delay before hiding
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
          }}
        >
          {/* Subtle gradient background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(196, 163, 90, 0.03) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Loading content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Progress number */}
            <motion.div
              style={{
                fontSize: 'clamp(72px, 20vw, 140px)',
                fontWeight: 100,
                color: '#ffffff',
                fontFamily: 'var(--font-inter), sans-serif',
                letterSpacing: '-8px',
                lineHeight: 1,
                position: 'relative',
              }}
            >
              <motion.span
                style={{
                  color: '#ffffff',
                }}
              >
                {progress}
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
