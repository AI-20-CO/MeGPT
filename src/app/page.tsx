'use client';

import { ThemeProvider, useTheme } from '@/context';
import { FluidCursor, LoadingScreen } from '@/components/ui';
import { Sidebar } from '@/components/layout';
import { Hero, About, Skills, Experience, Projects, Contact } from '@/components/sections';

function MainContent() {
  const { colors } = useTheme();
  
  return (
    <>
      <LoadingScreen />
      <FluidCursor />
      <Sidebar />
      <main
        style={{
          minHeight: '100vh',
          background: colors.background,
          transition: 'background 0.5s ease',
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
        /* Mobile - bottom nav padding */
        @media (max-width: 768px) {
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
