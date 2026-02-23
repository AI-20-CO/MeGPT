'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface SectionState {
  isActive: boolean;
  isEntering: boolean;
  isLeaving: boolean;
  direction: 'up' | 'down' | null;
}

export function useSectionTransition(sectionId: string, threshold = 0.3) {
  const [state, setState] = useState<SectionState>({
    isActive: false,
    isEntering: false,
    isLeaving: false,
    direction: null,
  });
  
  const sectionRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const wasActive = useRef(false);

  const checkVisibility = useCallback(() => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const currentScrollY = window.scrollY;
    const scrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';
    lastScrollY.current = currentScrollY;

    // Calculate how much of the section is visible
    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(windowHeight, rect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const visibilityRatio = visibleHeight / windowHeight;

    // Section is considered "active" when it takes up most of the viewport
    const isNowActive = visibilityRatio > threshold && rect.top < windowHeight * 0.5;

    if (isNowActive !== wasActive.current) {
      if (isNowActive) {
        // Entering the section
        setState({
          isActive: true,
          isEntering: true,
          isLeaving: false,
          direction: scrollDirection,
        });
        
        // Reset entering state after animation
        setTimeout(() => {
          setState(prev => ({ ...prev, isEntering: false }));
        }, 800);
      } else {
        // Leaving the section
        setState({
          isActive: false,
          isEntering: false,
          isLeaving: true,
          direction: scrollDirection,
        });
        
        // Reset leaving state after animation
        setTimeout(() => {
          setState(prev => ({ ...prev, isLeaving: false }));
        }, 600);
      }
      wasActive.current = isNowActive;
    }
  }, [threshold]);

  useEffect(() => {
    // Initial check
    checkVisibility();

    // Throttled scroll handler
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          checkVisibility();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkVisibility);
    };
  }, [checkVisibility]);

  return { ref: sectionRef, ...state };
}

// Animation variants for different element positions
export const getTransitionVariants = (position: 'left' | 'right' | 'top' | 'bottom' | 'center') => {
  const distance = 80;
  const offsets = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    top: { x: 0, y: -distance },
    bottom: { x: 0, y: distance },
    center: { x: 0, y: 0, scale: 0.9 },
  };

  return {
    hidden: {
      opacity: 0,
      ...offsets[position],
      scale: position === 'center' ? 0.9 : 1,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
    },
    exitUp: {
      opacity: 0,
      y: -distance / 2,
      scale: 0.95,
    },
    exitDown: {
      opacity: 0,
      y: distance / 2,
      scale: 0.95,
    },
  };
};
