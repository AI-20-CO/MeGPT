'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

// Animated text that reveals character by character
const AnimatedText = ({ text, delay = 0, className = '', color }: { text: string; delay?: number; className?: string; color?: string }) => {
  return (
    <span className={className} style={{ display: 'inline-block', color }}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.03,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          style={{ display: 'inline-block', transformOrigin: 'bottom' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

// Floating particles - using fixed seed values to avoid hydration mismatch
const Particle = ({ delay, theme, index }: { delay: number; theme: string; index: number }) => {
  // Use index-based deterministic values instead of Math.random()
  const seed = (index * 2654435761) % 2147483647;
  const random1 = (seed % 1000) / 1000;
  const random2 = ((seed * 7) % 1000) / 1000;
  const random3 = ((seed * 13) % 1000) / 1000;
  const random4 = ((seed * 19) % 1000) / 1000;
  const random5 = ((seed * 23) % 1000) / 1000;
  const random6 = ((seed * 29) % 1000) / 1000;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
        y: [0, -200, -400, -600],
        x: [0, random1 * 100 - 50, random2 * 200 - 100, random3 * 300 - 150],
      }}
      transition={{
        duration: 8 + random4 * 4,
        delay: delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
      style={{
        position: 'absolute',
        bottom: '10%',
        left: `${random5 * 100}%`,
        width: random6 * 4 + 2,
        height: random1 * 4 + 2,
        borderRadius: '50%',
        background: theme === 'dark' 
          ? `rgba(196, 163, 90, ${random2 * 0.5 + 0.2})`
          : `rgba(13, 148, 136, ${random2 * 0.4 + 0.15})`,
        pointerEvents: 'none',
      }}
    />
  );
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { theme, colors } = useTheme();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [particles] = useState(() => Array.from({ length: 20 }, (_, i) => i));
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Smooth spring animations for mouse tracking
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax transforms
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  
  // Orb parallax
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const orbScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        mouseX.set(x * 30);
        mouseY.set(y * 30);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      id="home"
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: '0 24px',
        overflow: 'hidden',
        background: colors.background,
        transition: 'background 0.5s ease',
      }}
    >
      {/* Animated gradient mesh background */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: theme === 'dark' 
            ? `
              radial-gradient(ellipse at 30% 20%, rgba(196, 163, 90, 0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(192, 192, 192, 0.08) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 50%, rgba(196, 163, 90, 0.05) 0%, transparent 60%)
            `
            : `
              radial-gradient(ellipse at 30% 20%, rgba(13, 148, 136, 0.015) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(100, 150, 150, 0.01) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 50%, rgba(13, 148, 136, 0.008) 0%, transparent 60%)
            `,
          y: orbY1,
        }}
      />

      {/* Floating particles */}
      {particles.map((i) => (
        <Particle key={i} delay={i * 0.5} theme={theme} index={i} />
      ))}

      {/* Interactive orbs that respond to mouse */}
      <motion.div
        style={{
          position: 'absolute',
          top: '15%',
          right: '20%',
          width: 'clamp(250px, 35vw, 450px)',
          height: 'clamp(250px, 35vw, 450px)',
          borderRadius: '50%',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(196, 163, 90, 0.1) 0%, rgba(196, 163, 90, 0.03) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(13, 148, 136, 0.015) 0%, rgba(13, 148, 136, 0.005) 40%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          y: orbY1,
          scale: orbScale,
          x: smoothMouseX,
        }}
        animate={{
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: 'clamp(180px, 25vw, 300px)',
          height: 'clamp(180px, 25vw, 300px)',
          borderRadius: '50%',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(192, 192, 192, 0.08) 0%, transparent 60%)'
            : 'radial-gradient(circle, rgba(100, 100, 100, 0.05) 0%, transparent 60%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          y: orbY2,
        }}
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Subtle grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: theme === 'dark'
            ? `
              linear-gradient(rgba(196, 163, 90, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(196, 163, 90, 0.03) 1px, transparent 1px)
            `
            : `
              linear-gradient(rgba(13, 148, 136, 0.015) 1px, transparent 1px),
              linear-gradient(90deg, rgba(13, 148, 136, 0.015) 1px, transparent 1px)
            `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main content with parallax and 3D tilt */}
      <motion.div
        style={{
          maxWidth: 1000,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          opacity,
          scale,
          rotateX: smoothMouseY,
          rotateY: smoothMouseX,
          transformPerspective: 1000,
        }}
      >
        {/* Status badge with glow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 20px',
            borderRadius: '100px',
            background: theme === 'dark' 
              ? 'rgba(196, 163, 90, 0.08)' 
              : 'rgba(13, 148, 136, 0.04)',
            border: theme === 'dark'
              ? '1px solid rgba(196, 163, 90, 0.2)'
              : '1px solid rgba(13, 148, 136, 0.15)',
            marginBottom: 'clamp(30px, 6vw, 50px)',
            cursor: 'default',
            boxShadow: theme === 'dark'
              ? '0 0 30px rgba(196, 163, 90, 0.1)'
              : '0 0 20px rgba(13, 148, 136, 0.03)',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: colors.gold,
              boxShadow: theme === 'dark'
                ? '0 0 12px rgba(196, 163, 90, 0.8)'
                : '0 0 12px rgba(13, 148, 136, 0.6)',
            }}
          />
          <span style={{ fontSize: '12px', color: colors.textMuted, letterSpacing: '1px' }}>
            Available for opportunities
          </span>
        </motion.div>

        {/* Name with character animation */}
        <motion.h1
          style={{
            fontSize: 'clamp(48px, 12vw, 120px)',
            fontWeight: 200,
            color: colors.text,
            margin: 0,
            lineHeight: 1,
            letterSpacing: '-2px',
          }}
        >
          <AnimatedText text="Ayaan Izhar" delay={0.5} color={colors.text} />
        </motion.h1>

        {/* Role with gradient */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{
            marginTop: 'clamp(16px, 3vw, 24px)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <motion.span
            style={{
              fontSize: 'clamp(16px, 3vw, 22px)',
              fontWeight: 300,
              color: colors.gold,
            }}
          >
            Software Engineer
          </motion.span>
          <span style={{ color: colors.textMuted }}>•</span>
          <span style={{ fontSize: 'clamp(14px, 2.5vw, 18px)', color: colors.textMuted, fontWeight: 300 }}>
            Full-Stack Developer
          </span>
        </motion.div>

        {/* Bio text with typing effect */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          style={{
            marginTop: 'clamp(24px, 5vw, 40px)',
            fontSize: 'clamp(14px, 2.5vw, 18px)',
            color: colors.textMuted,
            lineHeight: 1.8,
            maxWidth: 600,
            fontWeight: 300,
          }}
        >
          Crafting scalable solutions and modern digital experiences.
          <br />
          Currently building impactful software at{' '}
          <motion.span
            style={{ color: colors.gold }}
            whileHover={{ textShadow: theme === 'dark' 
              ? '0 0 20px rgba(196, 163, 90, 0.5)'
              : '0 0 20px rgba(13, 148, 136, 0.4)' 
            }}
          >
            Experian PLC
          </motion.span>
        </motion.p>

        {/* CTA buttons with magnetic hover */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          style={{
            marginTop: 'clamp(40px, 8vw, 60px)',
            display: 'flex',
            gap: 'clamp(12px, 3vw, 20px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <MagneticButton href="#projects" primary>
            View Work
          </MagneticButton>
          <MagneticButton href="#contact">
            Get in Touch
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator with bounce */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        style={{
          position: 'absolute',
          bottom: 'clamp(30px, 6vh, 50px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '10px', letterSpacing: '3px', color: colors.textMuted, textTransform: 'uppercase' }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '1px',
            height: '40px',
            background: theme === 'dark' 
              ? 'linear-gradient(to bottom, rgba(196, 163, 90, 0.5), transparent)'
              : 'linear-gradient(to bottom, rgba(13, 148, 136, 0.5), transparent)',
          }}
        />
      </motion.div>
    </section>
  );
}

// Magnetic button component with WOW effects
function MagneticButton({ children, href, primary = false }: { children: React.ReactNode; href: string; primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const { theme, colors } = useTheme();

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set((e.clientX - centerX) * 0.3);
      y.set((e.clientY - centerY) * 0.3);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        x,
        y,
        padding: primary ? '18px 40px' : '18px 36px',
        borderRadius: '14px',
        background: primary 
          ? theme === 'dark'
            ? 'linear-gradient(135deg, rgba(196, 163, 90, 0.15) 0%, rgba(196, 163, 90, 0.08) 100%)'
            : 'linear-gradient(135deg, rgba(13, 148, 136, 0.12) 0%, rgba(13, 148, 136, 0.06) 100%)'
          : theme === 'dark'
            ? 'rgba(255, 255, 255, 0.03)'
            : 'rgba(0, 0, 0, 0.03)',
        border: primary 
          ? theme === 'dark'
            ? '1px solid rgba(196, 163, 90, 0.4)'
            : '1px solid rgba(13, 148, 136, 0.35)'
          : theme === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.12)'
            : '1px solid rgba(0, 0, 0, 0.12)',
        color: primary ? colors.gold : colors.textMuted,
        fontSize: '14px',
        fontWeight: 500,
        textDecoration: 'none',
        letterSpacing: '0.5px',
        cursor: 'pointer',
        display: 'inline-block',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{
        scale: 1.08,
        boxShadow: primary 
          ? theme === 'dark'
            ? '0 0 60px rgba(196, 163, 90, 0.4), 0 0 100px rgba(196, 163, 90, 0.2), inset 0 0 30px rgba(196, 163, 90, 0.1)'
            : '0 0 60px rgba(13, 148, 136, 0.3), 0 0 100px rgba(13, 148, 136, 0.15), inset 0 0 30px rgba(13, 148, 136, 0.08)'
          : theme === 'dark'
            ? '0 0 40px rgba(255, 255, 255, 0.15), 0 0 80px rgba(255, 255, 255, 0.05)'
            : '0 0 40px rgba(0, 0, 0, 0.1), 0 0 80px rgba(0, 0, 0, 0.05)',
        borderColor: primary 
          ? theme === 'dark' ? 'rgba(196, 163, 90, 0.8)' : 'rgba(13, 148, 136, 0.6)'
          : theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.25)',
      }}
      whileTap={{ 
        scale: 0.95,
        boxShadow: primary 
          ? theme === 'dark'
            ? '0 0 80px rgba(196, 163, 90, 0.6), inset 0 0 40px rgba(196, 163, 90, 0.3)'
            : '0 0 80px rgba(13, 148, 136, 0.4), inset 0 0 40px rgba(13, 148, 136, 0.2)'
          : theme === 'dark'
            ? '0 0 60px rgba(255, 255, 255, 0.3)'
            : '0 0 60px rgba(0, 0, 0, 0.2)',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* Animated shimmer effect */}
      <motion.div
        animate={isHovered ? {
          x: ['0%', '200%'],
        } : {}}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '50%',
          height: '100%',
          background: `linear-gradient(90deg, transparent, ${primary 
            ? theme === 'dark' ? 'rgba(196, 163, 90, 0.3)' : 'rgba(13, 148, 136, 0.25)'
            : theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
          }, transparent)`,
          pointerEvents: 'none',
          transform: 'skewX(-20deg)',
        }}
      />
      
      {/* Glow pulse on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: -2,
            borderRadius: '16px',
            border: `2px solid ${primary 
              ? theme === 'dark' ? 'rgba(196, 163, 90, 0.5)' : 'rgba(13, 148, 136, 0.4)'
              : theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
            }`,
            pointerEvents: 'none',
          }}
        />
      )}
      
      {/* Particle explosion on hover */}
      {isHovered && [...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: Math.cos(i * 60 * Math.PI / 180) * 40,
            y: Math.sin(i * 60 * Math.PI / 180) * 40,
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.05,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: primary ? colors.gold : colors.textMuted,
            pointerEvents: 'none',
          }}
        />
      ))}
      
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </motion.a>
  );
}
