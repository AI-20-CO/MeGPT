'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { FloatingOrb } from '@/components/ui';
import { createVariants, containerVariants, sectionViewportVariants, sectionViewportConfig } from '@/utils/animations';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.35 });
  const { theme, colors } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Skip parallax on mobile for performance
  const parallaxY = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [40, -40]);

  return (
    <section
      id="about"
      ref={ref}
      style={{
        minHeight: '100dvh',
        padding: 'clamp(60px, 10vw, 80px) clamp(16px, 4vw, 24px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic background orbs */}
      <FloatingOrb 
        delay={0} 
        duration={8} 
        size={300} 
        left="10%" 
        top="20%" 
        color={theme === 'dark' ? 'rgba(196, 163, 90, 0.15)' : 'rgba(13, 148, 136, 0.1)'} 
      />
      <FloatingOrb 
        delay={2} 
        duration={10} 
        size={200} 
        left="80%" 
        top="60%" 
        color={theme === 'dark' ? 'rgba(192, 192, 192, 0.1)' : 'rgba(100, 100, 100, 0.08)'} 
      />
      <FloatingOrb 
        delay={4} 
        duration={12} 
        size={250} 
        left="50%" 
        top="80%" 
        color={theme === 'dark' ? 'rgba(196, 163, 90, 0.08)' : 'rgba(13, 148, 136, 0.06)'} 
      />
      
      {/* Animated gradient overlay - static on mobile */}
      {!isMobile && (
        <motion.div
          animate={{
            background: theme === 'dark' ? [
              'radial-gradient(ellipse at 20% 30%, rgba(196, 163, 90, 0.05) 0%, transparent 50%)',
              'radial-gradient(ellipse at 80% 70%, rgba(196, 163, 90, 0.05) 0%, transparent 50%)',
              'radial-gradient(ellipse at 20% 30%, rgba(196, 163, 90, 0.05) 0%, transparent 50%)',
            ] : [
              'radial-gradient(ellipse at 20% 30%, rgba(13, 148, 136, 0.04) 0%, transparent 50%)',
              'radial-gradient(ellipse at 80% 70%, rgba(13, 148, 136, 0.04) 0%, transparent 50%)',
              'radial-gradient(ellipse at 20% 30%, rgba(13, 148, 136, 0.04) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
          }}
        />
      )}
      
      <motion.div
        variants={sectionViewportVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: sectionViewportConfig.amount, margin: sectionViewportConfig.margin }}
        style={{ maxWidth: 1000, width: '100%', position: 'relative', zIndex: 1 }}
      >
        {/* Header - animates from left */}
        <motion.div
          variants={createVariants('left', 80)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span
            style={{
              fontSize: 'clamp(10px, 2vw, 11px)',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: theme === 'dark' ? 'rgba(196, 163, 90, 0.6)' : 'rgba(168, 85, 247, 0.8)',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            About
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-syncopate), sans-serif',
              fontSize: 'clamp(24px, 4vw, 42px)',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: colors.text,
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: '1px',
            }}
          >
            Building the future,
            <br />
            <span style={{ color: colors.gold }}>one line at a time</span>
          </h2>
        </motion.div>

        {/* Cards container - staggered animations */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{
            marginTop: 'clamp(40px, 8vw, 60px)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(16px, 3vw, 24px)',
          }}
        >
          {/* Bio card - animates from bottom */}
          <motion.div
            variants={createVariants('bottom', 60)}
            style={{
              padding: 'clamp(24px, 4vw, 32px)',
              borderRadius: '20px',
              background: theme === 'dark'
                ? 'linear-gradient(145deg, rgba(196, 163, 90, 0.04) 0%, rgba(192, 192, 192, 0.02) 100%)'
                : 'linear-gradient(145deg, rgba(168, 85, 247, 0.08) 0%, rgba(34, 211, 238, 0.04) 100%)',
              border: theme === 'dark'
                ? '1px solid rgba(196, 163, 90, 0.1)'
                : '1px solid rgba(168, 85, 247, 0.2)',
            }}
          >
            <motion.div style={{ y: parallaxY }}>
              <p
                style={{
                  fontSize: 'clamp(13px, 2.5vw, 15px)',
                  lineHeight: 1.9,
                  color: colors.textMuted,
                }}
              >
                I&apos;m a passionate software engineer currently pursuing my Bachelor&apos;s in Software Engineering 
                at Taylor&apos;s University. With hands-on experience at Experian PLC, I specialize in building 
                scalable applications using modern technologies.
              </p>
              <p
                style={{
                  fontSize: 'clamp(13px, 2.5vw, 15px)',
                  lineHeight: 1.9,
                  color: colors.textMuted,
                  marginTop: '20px',
                }}
              >
                My focus lies in full-stack development, AI/ML integration, and creating seamless 
                user experiences that make a real impact.
              </p>
            </motion.div>
          </motion.div>

          {/* Education card - animates from right */}
          <motion.div
            variants={createVariants('right', 60)}
            style={{
              padding: 'clamp(24px, 4vw, 32px)',
              borderRadius: '20px',
              background: theme === 'dark'
                ? 'linear-gradient(145deg, rgba(192, 192, 192, 0.04) 0%, rgba(196, 163, 90, 0.02) 100%)'
                : 'linear-gradient(145deg, rgba(100, 100, 100, 0.05) 0%, rgba(13, 148, 136, 0.03) 100%)',
              border: theme === 'dark'
                ? '1px solid rgba(192, 192, 192, 0.1)'
                : '1px solid rgba(100, 100, 100, 0.12)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-syncopate)',
                fontSize: 'clamp(10px, 2vw, 12px)',
                fontWeight: 600,
                color: colors.silver,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '20px',
              }}
            >
              Education
            </h3>
            <div>
              <p style={{ fontSize: 'clamp(15px, 3vw, 17px)', fontWeight: 500, color: colors.text }}>
                Taylor&apos;s University
              </p>
              <p style={{ fontSize: 'clamp(12px, 2.5vw, 14px)', color: colors.textMuted, marginTop: '6px' }}>
                BSE (Hons) Software Engineering
              </p>
              <p style={{ fontSize: 'clamp(11px, 2vw, 13px)', color: colors.gold, marginTop: '8px' }}>
                CGPA: 3.60 • 2023 - 2026
              </p>
            </div>
          </motion.div>

          {/* Location card - animates from bottom */}
          <motion.div
            variants={createVariants('bottom', 60)}
            style={{
              padding: 'clamp(24px, 4vw, 32px)',
              borderRadius: '20px',
              background: theme === 'dark'
                ? 'linear-gradient(145deg, rgba(196, 163, 90, 0.03) 0%, rgba(192, 192, 192, 0.02) 100%)'
                : 'linear-gradient(145deg, rgba(13, 148, 136, 0.04) 0%, rgba(100, 100, 100, 0.02) 100%)',
              border: theme === 'dark'
                ? '1px solid rgba(196, 163, 90, 0.08)'
                : '1px solid rgba(13, 148, 136, 0.12)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-syncopate)',
                fontSize: 'clamp(10px, 2vw, 12px)',
                fontWeight: 600,
                color: theme === 'dark' ? 'rgba(196, 163, 90, 0.6)' : 'rgba(13, 148, 136, 0.8)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '20px',
              }}
            >
              Currently
            </h3>
            <p style={{ fontSize: 'clamp(15px, 3vw, 17px)', fontWeight: 500, color: colors.text }}>
              Kuala Lumpur, Malaysia
            </p>
            <p style={{ fontSize: 'clamp(12px, 2.5vw, 14px)', color: colors.textMuted, marginTop: '6px' }}>
              Software Engineering Intern @ Experian PLC
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '16px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: theme === 'dark' ? 'rgba(196, 163, 90, 0.2)' : 'rgba(13, 148, 136, 0.2)',
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: colors.gold,
                  animation: 'pulse 2s infinite',
                }}
              />
              <span style={{ fontSize: 'clamp(10px, 2vw, 11px)', color: colors.gold }}>
                Open to opportunities
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
