'use client';

import dynamic from 'next/dynamic';
import { ThemeProvider, useTheme } from '@/context';
import { LoadingScreen } from '@/components/ui';
import { Sidebar } from '@/components/layout';
import { Hero, About, Skills, Experience, Projects, Contact, ChatLanding } from '@/components/sections';
import { useScroll, useTransform, motion, useSpring } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';

// Lazy load heavy WebGL component - this is the main performance killer
const Hyperspeed = dynamic(() => import('@/components/ui/Hyperspeed').then(mod => mod.default), {
  ssr: false,
  loading: () => null, // No loading indicator - it fades in anyway
});

// Lazy load decorative cursor - not needed for initial render
const FluidCursor = dynamic(() => import('@/components/ui/FluidCursor').then(mod => mod.default), {
  ssr: false,
  loading: () => null,
});

function MainContent() {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    // Delay heavy component hydration to prioritize initial render
    const timer = setTimeout(() => setIsHydrated(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Scroll-based opacity for Hyperspeed - starts invisible, fades in, then goes to full brightness at the bottom "Ask" section
  const { scrollYProgress } = useScroll();
  
  // Combines initial scroll fade-in with end-of-page full brightness
  const hyperspeedOpacityRaw = useTransform(
    scrollYProgress,
    [0, 0.05, 0.1, 0.85, 1],
    [0, 0, 0.4, 0.4, 1]
  );
  
  // On mobile, use near-instant response to prevent scroll jitter
  const hyperspeedOpacity = useSpring(hyperspeedOpacityRaw, isMobile 
    ? { stiffness: 300, damping: 100, restDelta: 0.01 }
    : { stiffness: 100, damping: 30, restDelta: 0.001 }
  );
  
  return (
    <>
      <LoadingScreen />
      {isHydrated && <FluidCursor />}
      <Sidebar />
      
      {/* Fixed Hyperspeed background with scroll-based fade in - loaded after hydration */}
      {isHydrated && (
        <motion.div style={{ 
          position: 'fixed', 
          inset: 0, 
          opacity: hyperspeedOpacity,
          zIndex: 0,
          pointerEvents: 'none'
        }}>
          <Suspense fallback={null}>
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
          </Suspense>
        </motion.div>
      )}
      
      <main
        style={{
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Background Overlay - Fades out before the 100vh padding at the bottom so the "new page" is clear */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: theme === 'dark' 
            ? 'linear-gradient(to bottom, rgba(10, 10, 10, 0.75) 0%, rgba(10, 10, 10, 0.75) calc(100% - 120vh), transparent calc(100% - 80vh))'
            : 'transparent',
          zIndex: -1,
          pointerEvents: 'none',
          transition: 'background 0.5s ease',
        }} />
        <ChatLanding />
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
