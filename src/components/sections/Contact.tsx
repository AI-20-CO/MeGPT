'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { FloatingOrb } from '@/components/ui';
import { createVariants, containerVariants } from '@/utils/animations';

// Animated line component
function AnimatedLine({ delay, theme }: { delay: number; theme: string }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 0.1 }}
      transition={{ duration: 1.5, delay, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        height: '1px',
        width: '100%',
        background: theme === 'dark' 
          ? 'linear-gradient(90deg, transparent, rgba(196, 163, 90, 0.3), transparent)'
          : 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.3), transparent)',
        transformOrigin: 'center',
      }}
    />
  );
}

export default function Contact() {
  const ref = useRef(null);
  const { theme, colors } = useTheme();
  const isInView = useInView(ref, { amount: 0.35 });
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isEmailHovered, setIsEmailHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  const contactLinks = [
    { 
      label: 'Email', 
      value: 'ayaan.izhar01@gmail.com', 
      href: 'mailto:ayaan.izhar01@gmail.com',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    },
    { 
      label: 'Phone', 
      value: '+60 10-430 1423', 
      href: 'tel:+60104301423',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      )
    },
    { 
      label: 'LinkedIn', 
      value: 'linkedin.com/in/ayaan-izhar', 
      href: 'https://www.linkedin.com/in/ayaan-izhar-8293b8371/',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    },
    { 
      label: 'GitHub', 
      value: 'github.com/AI-20-CO', 
      href: 'https://github.com/AI-20-CO',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      )
    },
  ];

  const orbColor1 = theme === 'dark' ? 'rgba(196, 163, 90, 0.12)' : 'rgba(13, 148, 136, 0.02)';
  const orbColor2 = theme === 'dark' ? 'rgba(192, 192, 192, 0.08)' : 'rgba(100, 100, 100, 0.015)';
  const orbColor3 = theme === 'dark' ? 'rgba(196, 163, 90, 0.07)' : 'rgba(13, 148, 136, 0.015)';

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        minHeight: '100vh',
        padding: 'clamp(60px, 12vw, 100px) clamp(16px, 4vw, 24px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic background orbs */}
      <FloatingOrb delay={0} duration={9} size={300} left="10%" top="20%" color={orbColor1} />
      <FloatingOrb delay={2} duration={11} size={220} left="75%" top="50%" color={orbColor2} />
      <FloatingOrb delay={4} duration={13} size={250} left="45%" top="70%" color={orbColor3} />
      
      {/* Decorative lines */}
      <div style={{ position: 'absolute', top: '30%', width: '100%' }}>
        <AnimatedLine delay={0.5} theme={theme} />
      </div>
      <div style={{ position: 'absolute', top: '70%', width: '100%' }}>
        <AnimatedLine delay={0.8} theme={theme} />
      </div>
      
      {/* Animated gradient overlay */}
      <motion.div
        animate={{
          background: [
            `radial-gradient(ellipse at 30% 40%, ${theme === 'dark' ? 'rgba(196, 163, 90, 0.05)' : 'rgba(13, 148, 136, 0.008)' } 0%, transparent 50%)`,
            `radial-gradient(ellipse at 70% 60%, ${theme === 'dark' ? 'rgba(196, 163, 90, 0.05)' : 'rgba(13, 148, 136, 0.008)'} 0%, transparent 50%)`,
            `radial-gradient(ellipse at 30% 40%, ${theme === 'dark' ? 'rgba(196, 163, 90, 0.05)' : 'rgba(13, 148, 136, 0.008)'} 0%, transparent 50%)`,
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      />

      <motion.div 
        style={{ 
          maxWidth: 900, 
          width: '100%', 
          textAlign: 'center', 
          y, 
          scale,
          position: 'relative', 
          zIndex: 1 
        }}
      >
        {/* Header */}
        <motion.div
          variants={createVariants('top', 80)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <span
            style={{
              fontSize: '12px',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              color: colors.goldMuted,
              display: 'block',
              marginBottom: '16px',
              transition: 'color 0.5s ease',
            }}
          >
            Get In Touch
          </span>
          <h2
            style={{
              fontSize: 'clamp(36px, 8vw, 72px)',
              fontWeight: 200,
              color: colors.text,
              margin: '0 0 24px 0',
              lineHeight: 1.1,
              transition: 'color 0.5s ease',
            }}
          >
            Let&apos;s work{' '}
            <span style={{ 
              color: colors.gold,
            }}>
              together
            </span>
          </h2>
          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.8,
              color: colors.textMuted,
              maxWidth: 550,
              margin: '0 auto 60px auto',
              padding: '0 16px',
              transition: 'color 0.5s ease',
            }}
          >
            Currently available for internship opportunities and collaborative projects. 
            Based in Kuala Lumpur, Malaysia.
          </p>
        </motion.div>

        {/* Contact Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="contact-grid"
          style={{
            display: 'grid',
            gap: '16px',
            marginBottom: '60px',
          }}
        >
          {contactLinks.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.label === 'LinkedIn' || link.label === 'GitHub' ? '_blank' : undefined}
              rel={link.label === 'LinkedIn' || link.label === 'GitHub' ? 'noopener noreferrer' : undefined}
              variants={createVariants(index === 0 ? 'left' : index === 2 ? 'right' : 'bottom', 50)}
              onMouseEnter={() => setHoveredLink(link.label)}
              onMouseLeave={() => setHoveredLink(null)}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="contact-card"
              style={{
                padding: 'clamp(16px, 3vw, 24px)',
                borderRadius: '20px',
                background: hoveredLink === link.label ? colors.cardBgHover : colors.cardBg,
                border: `1px solid ${hoveredLink === link.label ? colors.borderHover : colors.border}`,
                textDecoration: 'none',
                textAlign: 'left',
                transition: 'all 0.4s ease',
                boxShadow: hoveredLink === link.label 
                  ? `0 20px 40px ${theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'}`
                  : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle gradient overlay on hover */}
              <motion.div
                animate={{ opacity: hoveredLink === link.label ? 1 : 0 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at 50% 0%, ${theme === 'dark' ? 'rgba(196, 163, 90, 0.2)' : 'rgba(168, 85, 247, 0.2)'} 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />
              
              {/* Icon */}
              <motion.div
                animate={{ 
                  color: hoveredLink === link.label ? colors.gold : colors.textMuted,
                  scale: hoveredLink === link.label ? 1.1 : 1,
                }}
                style={{
                  marginBottom: '16px',
                  transition: 'color 0.3s ease',
                }}
              >
                {link.icon}
              </motion.div>
              
              {/* Label */}
              <span
                style={{
                  display: 'block',
                  fontSize: '11px',
                  color: hoveredLink === link.label ? colors.gold : colors.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  marginBottom: '8px',
                  transition: 'color 0.3s ease',
                }}
              >
                {link.label}
              </span>
              
              {/* Value */}
              <span
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: hoveredLink === link.label ? colors.text : colors.textSecondary,
                  wordBreak: 'break-all',
                  transition: 'color 0.3s ease',
                }}
              >
                {link.value}
              </span>
            </motion.a>
          ))}
        </motion.div>

        {/* Large CTA Email */}
        <motion.div
          variants={createVariants('bottom', 60)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.a
            href="mailto:ayaan.izhar01@gmail.com"
            onMouseEnter={() => setIsEmailHovered(true)}
            onMouseLeave={() => setIsEmailHovered(false)}
            whileHover={{ scale: 1.03 }}
            style={{
              fontSize: 'clamp(24px, 5vw, 42px)',
              fontWeight: 300,
              color: isEmailHovered ? (theme === 'dark' ? '#e8d5a3' : '#d4b86a') : colors.gold,
              textDecoration: 'none',
              display: 'inline-block',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.3s ease',
            }}
          >
            ayaan.izhar01@gmail.com
            
            {/* Underline effect */}
            <motion.span
              animate={{ 
                scaleX: isEmailHovered ? 1 : 0,
                opacity: isEmailHovered ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                bottom: '-4px',
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`,
                transformOrigin: 'center',
              }}
            />
          </motion.a>
        </motion.div>

        {/* Decorative bottom element */}
        <motion.div
          variants={createVariants('center', 0)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{
            marginTop: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          <motion.div
            animate={{ scaleX: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '60px',
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`,
            }}
          />
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: colors.gold,
            opacity: 0.6,
          }} />
          <motion.div
            animate={{ scaleX: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{
              width: '60px',
              height: '1px',
              background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`,
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
