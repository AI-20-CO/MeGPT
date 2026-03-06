'use client';

import { ThemeProvider, useTheme } from '@/context';
import { FluidCursor, LoadingScreen, Hyperspeed } from '@/components/ui';
import { Sidebar } from '@/components/layout';
import { Hero, About, Skills, Experience, Projects, Contact } from '@/components/sections';
import { useScroll, useTransform, motion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

function MainContent() {
  const { theme } = useTheme();
  const [windowHeight, setWindowHeight] = useState(1000);
  
  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Scroll-based opacity for Hyperspeed - starts invisible, fades in as you scroll to About
  const { scrollY } = useScroll();
  
  // Hyperspeed fades in between 0 and 100vh (Hero section height)
  const hyperspeedOpacityRaw = useTransform(
    scrollY,
    [0, windowHeight * 0.5, windowHeight],
    [0, 0, 0.4]
  );
  
  // Smooth spring for buttery transition
  const hyperspeedOpacity = useSpring(hyperspeedOpacityRaw, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  return (
    <>
      <LoadingScreen />
      <FluidCursor />
      <Sidebar />
      
      {/* Fixed Hyperspeed background with scroll-based fade in */}
      <motion.div style={{ 
        position: 'fixed', 
        inset: 0, 
        opacity: hyperspeedOpacity,
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <Hyperspeed
          effectOptions={{
            colors: {
              roadColor: theme === 'dark' ? 0x080808 : 0x080808,
              islandColor: theme === 'dark' ? 0x0a0a0a : 0x0a0a0a,
              background: theme === 'dark' ? 0x000000 : 0x000000,
              shoulderLines: theme === 'dark' ? 0x131318 : 0xc084fc,
              brokenLines: theme === 'dark' ? 0x131318 : 0xd8b4fe,
              leftCars: theme === 'dark' 
                ? [0xc4a35a, 0xa88a4a, 0xc4a35a] 
                : [0xd946ef, 0xc026d3, 0xa855f7],
              rightCars: theme === 'dark'
                ? [0xc0c0c0, 0xa0a0a0, 0xc0c0c0]
                : [0xf0abfc, 0xe879f9, 0xc084fc],
              sticks: theme === 'dark' ? 0xc4a35a : 0xe879f9,
            },
          }}
        />
      </motion.div>
      
      <main
        style={{
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
          transition: 'background 0.5s ease',
          background: theme === 'dark' 
            ? 'rgba(10, 10, 10, 0.75)' 
            : 'transparent',
        }}
      >
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>

      <style jsx global>{`
        /* Theme-aware body background */
        body {
          background: ${theme === 'dark' ? '#0a0a0a' : '#0a0a0a'} !important;
        }
        /* Mobile and Tablet - bottom nav padding */
        @media (max-width: 1200px) {
          main {
            padding-bottom: 100px;
          }
        }
      `}</style>
    </>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}
