'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Orb } from '@/components/ui';

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
  
  // Hero section scroll progress (for text opacity/scale)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  
  // Full page scroll progress (for orb animation throughout entire page)
  const { scrollYProgress: fullPageProgress } = useScroll();

  // Smooth spring animations for mouse tracking
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax transforms
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  
  // Orb parallax (gradient orbs - hero section only)
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  
  // Responsive breakpoint
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Aesthetic Parallax Path mapped to sections
  // Maps roughly to: Hero(0), About(0.2), Skills(0.4), Experience(0.6), Projects(0.8), Contact(1)
  
  // Weaves delicately, but centers during Experience (0.6) then expands away
  const orbMainXRaw = useTransform(
    fullPageProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    // If mobile, keep it more centered due to limited width
    isMobile 
      ? ['-50%', '-50%', '-50%', '-50%', '-50%', '-50%']
      : ['-50%', '-20%', '-80%', '-50%', '-75%', '-50%']
  );

  // Y-Position: Carefully calibrated to sync with viewports
  // 0% = Hero, 20% = About, 40% = Skills, 60% = Experience, 80% = Projects, 100% = Contact
  // Using vh units mapping to ensure it stays in the viewport regardless of device height
  const orbMainYRaw = useTransform(
    fullPageProgress, 
    [0, 0.2, 0.4, 0.6, 0.8, 1], 
    isMobile
      ? ['0vh', '100vh', '200vh', '300vh', '400vh', '500vh']
      : ['0vh', '120vh', '240vh', '360vh', '480vh', '600vh']
  );
  
  // Breaths dynamically. Around Experience (0.6), it centers and is medium size.
  // Between Experience (0.6) and Projects (0.8), it expands massively as a transition
  const orbMainScaleRaw = useTransform(
    fullPageProgress, 
    [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], 
    // Mobile uses slightly smaller scales to prevent overflow issues. Hero (0) is adjusted slightly larger now.
    isMobile
      ? [0.98, 0.5, 1.2, 0.4, 1.3, 0.45, 1.0,  2.5, 0.4, 1.3, 0.5]
      : [1.02, 0.5, 1.4, 0.4, 1.5, 0.45, 1.2,  3.0, 0.4, 1.5, 0.5]
  );

  // Opacity adjustments:
  // Is visible during Experience (0.6), massively faded at Projects (0.8 and beyond)
  const orbMainOpacityRaw = useTransform(
    fullPageProgress,
    [0, 0.1, 0.3, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    [0.6, 0.25, 0.4, 0.2, 0.5, 0.05, 0.0, 0.0, 0.0] // Fades entirely to 0 at 0.8 (Projects) and stays invisible
  );
  
  // Softer spring configuration for a more floaty, ethereal movement
  const orbSpringConfig = { damping: 40, stiffness: 45, mass: 1.5 };
  const orbMainX = useSpring(orbMainXRaw, orbSpringConfig);
  const orbMainY = useSpring(orbMainYRaw, orbSpringConfig);
  const orbMainScale = useSpring(orbMainScaleRaw, orbSpringConfig);
  const orbMainOpacity = useSpring(orbMainOpacityRaw, orbSpringConfig);

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
        padding: '0 clamp(16px, 4vw, 24px)',
        overflowX: 'clip',
        overflowY: 'visible',
        transition: 'background 0.5s ease',
      }}
    >
      {/* Floating particles */}
      {particles.map((i) => (
        <Particle key={i} delay={i * 0.5} theme={theme} index={i} />
      ))}

      {/* Interactive WebGL Orb - Travels entire page weaving through content */}
      <motion.div
        className="hero-orb"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          x: orbMainX,
          y: orbMainY,
          translateY: '-50%',
          scale: orbMainScale,
          opacity: orbMainOpacity,
          pointerEvents: 'auto',
          zIndex: 0,
        }}
      >
        <Orb
          hue={theme === 'dark' ? 220 : 0}
          hoverIntensity={1.5}
          rotateOnHover={true}
          backgroundColor="#0a0a0a"
        />
      </motion.div>

      {/* Gradient orb accents */}
      <motion.div
        style={{
          position: 'absolute',
          top: '15%',
          right: '15%',
          width: 'clamp(200px, 30vw, 350px)',
          height: 'clamp(200px, 30vw, 350px)',
          borderRadius: '50%',
          background: theme === 'dark'
            ? 'radial-gradient(circle, rgba(196, 163, 90, 0.08) 0%, transparent 60%)'
            : 'radial-gradient(circle, rgba(217, 70, 239, 0.06) 0%, transparent 60%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          y: orbY1,
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

      {/* Secondary gradient orb */}
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
            : 'radial-gradient(circle, rgba(217, 70, 239, 0.08) 0%, transparent 60%)',
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
          position: 'relative',
          zIndex: 1,
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
            fontFamily: 'var(--font-syncopate), sans-serif',
            fontSize: 'clamp(30px, 6.5vw, 72px)',
            fontWeight: 400,
            textTransform: 'uppercase',
            color: colors.text,
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '10px',
            textShadow: '0 0 15px rgba(255,255,255,0.2), 0 0 30px rgba(196,163,90,0.1)',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          <AnimatedText text="AYAAN IZHAR" delay={0.5} color={colors.text} />
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
            gap: 'clamp(8px, 2vw, 16px)',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <motion.span
            style={{
              fontFamily: 'var(--font-syncopate), sans-serif',
              fontSize: 'clamp(9px, 1.5vw, 14px)',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              color: colors.gold,
              textShadow: '0 0 10px rgba(196, 163, 90, 0.2)',
              whiteSpace: 'nowrap',
            }}
          >
            Software Engineer
          </motion.span>
          <span style={{ color: colors.textMuted }}>•</span>
          <span style={{ 
            fontFamily: 'var(--font-syncopate), sans-serif',
            fontSize: 'clamp(9px, 1.5vw, 14px)', 
            color: colors.textMuted, 
            fontWeight: 400,
            textTransform: 'uppercase',
            letterSpacing: '1.5px', 
            textShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
            whiteSpace: 'nowrap',
          }}>
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
            color: 'rgba(255, 255, 255, 0.75)',
            lineHeight: 1.8,
            maxWidth: 600,
            fontWeight: 400,
            textShadow: '0 0 10px rgba(0,0,0,0.5)',
          }}
        >
          I like turning complex problems into elegant code and pixels into experiences people actually enjoy using.
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
      <motion.div style={{ opacity }}>
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
            left: '50%',
            transform: 'translateX(-50%)',
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
        padding: primary ? '14px 24px' : '14px 20px',
        borderRadius: '12px',
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
        fontFamily: 'var(--font-syncopate), sans-serif',
        fontSize: '11px',
        fontWeight: 400,
        textTransform: 'uppercase',
        textDecoration: 'none',
        letterSpacing: '1.5px',
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
