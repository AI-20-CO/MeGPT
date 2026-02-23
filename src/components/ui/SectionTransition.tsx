'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode, createContext, useContext, useState, useEffect } from 'react';

// Context to share section state with child components
interface SectionContextType {
  isActive: boolean;
  isEntering: boolean;
  isLeaving: boolean;
  direction: 'up' | 'down' | null;
}

const SectionContext = createContext<SectionContextType>({
  isActive: false,
  isEntering: false,
  isLeaving: false,
  direction: null,
});

export const useSectionContext = () => useContext(SectionContext);

interface SectionWrapperProps {
  children: ReactNode;
  id: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SectionWrapper({ children, id, className, style }: SectionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.4 });
  const lastScrollY = useRef(0);
  const [sectionState, setSectionState] = useState<SectionContextType>({
    isActive: false,
    isEntering: false,
    isLeaving: false,
    direction: null,
  });
  const wasActive = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';
      lastScrollY.current = currentScrollY;

      if (isInView !== wasActive.current) {
        if (isInView) {
          setSectionState({
            isActive: true,
            isEntering: true,
            isLeaving: false,
            direction,
          });
          setTimeout(() => {
            setSectionState(prev => ({ ...prev, isEntering: false }));
          }, 1000);
        } else {
          setSectionState({
            isActive: false,
            isEntering: false,
            isLeaving: true,
            direction,
          });
          setTimeout(() => {
            setSectionState(prev => ({ ...prev, isLeaving: false }));
          }, 600);
        }
        wasActive.current = isInView;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInView]);

  return (
    <SectionContext.Provider value={sectionState}>
      <div ref={ref} id={id} className={className} style={style}>
        {children}
      </div>
    </SectionContext.Provider>
  );
}

// Animated element wrapper for symmetrical entrance/exit
interface AnimatedElementProps {
  children: ReactNode;
  direction: 'left' | 'right' | 'top' | 'bottom' | 'center';
  delay?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedElement({ 
  children, 
  direction, 
  delay = 0, 
  duration = 0.7,
  className,
  style 
}: AnimatedElementProps) {
  const { isActive, direction: scrollDirection } = useSectionContext();
  
  const distance = 100;
  
  const getOffset = () => {
    switch (direction) {
      case 'left': return { x: -distance, y: 0 };
      case 'right': return { x: distance, y: 0 };
      case 'top': return { x: 0, y: -distance };
      case 'bottom': return { x: 0, y: distance };
      case 'center': return { x: 0, y: 0 };
    }
  };

  const offset = getOffset();
  
  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
      scale: direction === 'center' ? 0.8 : 0.95,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smooth feel
      },
    },
    exit: {
      opacity: 0,
      x: scrollDirection === 'down' ? -offset.x * 0.5 : offset.x * 0.5,
      y: scrollDirection === 'down' ? -40 : 40,
      scale: 0.95,
      filter: 'blur(5px)',
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 1, 1],
      },
    },
  };

  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      animate={isActive ? 'visible' : 'exit'}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

// Staggered container for multiple elements
interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function StaggerContainer({ 
  children, 
  staggerDelay = 0.1,
  className,
  style 
}: StaggerContainerProps) {
  const { isActive } = useSectionContext();
  
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      animate={isActive ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Individual stagger item
interface StaggerItemProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  className?: string;
  style?: React.CSSProperties;
}

export function StaggerItem({ 
  children, 
  direction = 'bottom',
  className,
  style 
}: StaggerItemProps) {
  const distance = 60;
  
  const getOffset = () => {
    switch (direction) {
      case 'left': return { x: -distance, y: 0 };
      case 'right': return { x: distance, y: 0 };
      case 'top': return { x: 0, y: -distance };
      case 'bottom': return { x: 0, y: distance };
      case 'center': return { x: 0, y: 0 };
    }
  };

  const offset = getOffset();

  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: {
          opacity: 0,
          x: offset.x,
          y: offset.y,
          scale: direction === 'center' ? 0.8 : 0.95,
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
