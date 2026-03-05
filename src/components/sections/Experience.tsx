'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { FloatingOrb } from '@/components/ui';
import { createVariants, containerVariants } from '@/utils/animations';

const experiences = [
  {
    role: 'Software Engineering Intern',
    company: 'Experian PLC',
    period: 'Sept 2025 - Present',
    location: 'Cyberjaya, Malaysia',
    description: [
      'Resolved Hazelcast instability during Karpenter node replacement, reducing downtime from ~60s to ~1s (~98% reduction)',
      'Migrated 35+ legacy RMI endpoints to Spring Boot REST APIs for Java 17 to Java 21 upgrade with 100% unit test coverage',
      'Designed centralized REST request-processing framework eliminating 1500+ lines of duplicated logic',
      'Built parameterized Jenkins CI/CD pipelines with release-candidate workflows and SonarQube quality gates',
    ],
    tech: ['Java', 'Spring Boot', 'Hazelcast', 'Jenkins', 'AWS EKS', 'Kubernetes'],
  },
];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.35 });
  const { theme, colors } = useTheme();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      id="experience"
      ref={ref}
      style={{
        minHeight: '100vh',
        padding: 'clamp(60px, 10vw, 80px) clamp(16px, 4vw, 24px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic background orbs - same as About */}
      <FloatingOrb 
        delay={0} 
        duration={9} 
        size={280} 
        left="75%" 
        top="15%" 
        color={theme === 'dark' ? 'rgba(192, 192, 192, 0.1)' : 'rgba(100, 100, 100, 0.08)'} 
      />
      <FloatingOrb 
        delay={3} 
        duration={11} 
        size={220} 
        left="10%" 
        top="60%" 
        color={theme === 'dark' ? 'rgba(196, 163, 90, 0.1)' : 'rgba(13, 148, 136, 0.08)'} 
      />
      <FloatingOrb 
        delay={5} 
        duration={13} 
        size={180} 
        left="40%" 
        top="85%" 
        color={theme === 'dark' ? 'rgba(196, 163, 90, 0.07)' : 'rgba(13, 148, 136, 0.05)'} 
      />
      
      {/* Animated gradient overlay */}
      <motion.div
        animate={{
          background: theme === 'dark' ? [
            'radial-gradient(ellipse at 70% 20%, rgba(192, 192, 192, 0.04) 0%, transparent 50%)',
            'radial-gradient(ellipse at 30% 80%, rgba(192, 192, 192, 0.04) 0%, transparent 50%)',
            'radial-gradient(ellipse at 70% 20%, rgba(192, 192, 192, 0.04) 0%, transparent 50%)',
          ] : [
            'radial-gradient(ellipse at 70% 20%, rgba(100, 100, 100, 0.03) 0%, transparent 50%)',
            'radial-gradient(ellipse at 30% 80%, rgba(100, 100, 100, 0.03) 0%, transparent 50%)',
            'radial-gradient(ellipse at 70% 20%, rgba(100, 100, 100, 0.03) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1200, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        {/* Header - animates from left */}
        <motion.div
          variants={createVariants('left', 80)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{ marginBottom: '20px', flexShrink: 0 }}
        >
          <span
            style={{
              fontSize: 'clamp(10px, 2vw, 11px)',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: theme === 'dark' ? 'rgba(196, 163, 90, 0.6)' : 'rgba(13, 148, 136, 0.7)',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            Experience
          </span>
          <h2
            style={{
              fontSize: 'clamp(28px, 6vw, 56px)',
              fontWeight: 200,
              color: colors.text,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Where I have worked
          </h2>
        </motion.div>

        {/* Experience cards - staggered from bottom */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{ display: 'flex', flexDirection: 'column', gap: '40px', y }}
        >
          {experiences.map((exp) => (
            <motion.div
              key={exp.company}
              variants={createVariants('bottom', 60)}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: 'clamp(24px, 5vw, 40px)',
                padding: 'clamp(24px, 5vw, 40px)',
                borderRadius: '24px',
                background: theme === 'dark'
                  ? 'linear-gradient(145deg, rgba(196, 163, 90, 0.04) 0%, rgba(192, 192, 192, 0.02) 100%)'
                  : 'linear-gradient(145deg, rgba(13, 148, 136, 0.05) 0%, rgba(100, 100, 100, 0.02) 100%)',
                border: theme === 'dark'
                  ? '1px solid rgba(196, 163, 90, 0.1)'
                  : '1px solid rgba(13, 148, 136, 0.15)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Left column - Role info */}
              <div>
                <h3
                  style={{
                    fontSize: 'clamp(18px, 4vw, 24px)',
                    fontWeight: 400,
                    color: colors.text,
                    margin: '0 0 8px 0',
                  }}
                >
                  {exp.role}
                </h3>
                <p
                  style={{
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    color: colors.gold,
                    margin: '0 0 16px 0',
                  }}
                >
                  {exp.company}
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: '16px',
                    flexWrap: 'wrap',
                    fontSize: 'clamp(11px, 2vw, 13px)',
                    color: colors.textMuted,
                  }}
                >
                  <span>{exp.period}</span>
                  <span>•</span>
                  <span>{exp.location}</span>
                </div>
              </div>

              {/* Right column - Description */}
              <div>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                  }}
                >
                  {exp.description.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                      style={{
                        fontSize: 'clamp(12px, 2.5vw, 14px)',
                        lineHeight: 1.7,
                        color: colors.textMuted,
                        marginBottom: '12px',
                        paddingLeft: '16px',
                        position: 'relative',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '8px',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                          background: colors.gold,
                        }}
                      />
                      {item}
                    </motion.li>
                  ))}
                </ul>

                {/* Tech stack */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginTop: '20px',
                  }}
                >
                  {exp.tech.map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.8 + i * 0.05 }}
                      whileHover={{ 
                        scale: 1.05, 
                        background: theme === 'dark' 
                          ? 'rgba(196, 163, 90, 0.15)' 
                          : 'rgba(13, 148, 136, 0.15)' 
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: theme === 'dark' 
                          ? 'rgba(196, 163, 90, 0.08)' 
                          : 'rgba(13, 148, 136, 0.1)',
                        border: theme === 'dark'
                          ? '1px solid rgba(196, 163, 90, 0.15)'
                          : '1px solid rgba(13, 148, 136, 0.2)',
                        fontSize: 'clamp(10px, 2vw, 11px)',
                        color: colors.gold,
                        cursor: 'default',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
