'use client';

import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { FloatingOrb } from '@/components/ui';
import { createVariants, containerVariants, sectionViewportVariants, sectionViewportConfig } from '@/utils/animations';

const projects = [
  {
    title: 'StyleSync',
    description: 'AI-driven fashion platform with personalized outfit recommendations.',
    tech: ['React Native', 'FastAPI', 'PostgreSQL', 'PyTorch'],
    category: 'Mobile App',
    highlight: 'Featured',
    links: { github: 'https://github.com/AI-20-CO/StylesSync-AI-Powered-Fashion-App', live: 'https://www.youtube.com/watch?v=KfduQByZijQ' },
    gradient: 'linear-gradient(135deg, rgba(196, 163, 90, 0.15) 0%, rgba(255, 200, 100, 0.05) 100%)',
  },
  {
    title: 'CheckMate',
    description: 'AI-powered misinformation detection with credibility scoring.',
    tech: ['Next.js', 'TypeScript', 'OpenAI API', 'ConvexDB'],
    category: 'Web App',
    highlight: '1st Runner Up',
    links: { github: 'https://github.com/AI-20-CO/checkmate', live: 'https://checkmate.mohtasham.dev/' },
    gradient: 'linear-gradient(135deg, rgba(192, 192, 192, 0.15) 0%, rgba(150, 150, 180, 0.05) 100%)',
  },
  {
    title: 'Mail Merge Tool',
    description: 'Automated grading email system for personalized student notifications.',
    tech: ['Python', 'Streamlit', 'MySQL', 'SMTP'],
    category: 'Tool',
    links: { github: 'https://github.com/AI-20-CO/Mail-Merge' },
    gradient: 'linear-gradient(135deg, rgba(196, 163, 90, 0.1) 0%, rgba(180, 140, 80, 0.05) 100%)',
  },
  {
    title: 'Alzheimer Prediction',
    description: 'ML models predicting diagnosis using lifestyle features.',
    tech: ['Python', 'Pandas', 'Scikit-learn'],
    category: 'ML/AI',
    links: { github: 'https://github.com/AI-20-CO/alzheimers-diagnosis-prediction-ml' },
    gradient: 'linear-gradient(135deg, rgba(150, 192, 192, 0.1) 0%, rgba(100, 180, 180, 0.05) 100%)',
  },
];

// 3D Tilt Card Component
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      x.set((e.clientX - rect.left) / rect.width - 0.5);
      y.set((e.clientY - rect.top) / rect.height - 0.5);
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.35 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { theme, colors } = useTheme();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);

  return (
    <section
      id="projects"
      ref={ref}
      style={{
        minHeight: '100vh',
        padding: 'clamp(60px, 10vw, 80px) clamp(16px, 4vw, 24px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Dynamic background orbs - same as About */}
      <FloatingOrb 
        delay={1} 
        duration={10} 
        size={260} 
        left="80%" 
        top="20%" 
        color={theme === 'dark' ? 'rgba(196, 163, 90, 0.1)' : 'rgba(13, 148, 136, 0.08)'} 
      />
      <FloatingOrb 
        delay={3} 
        duration={12} 
        size={200} 
        left="5%" 
        top="55%" 
        color={theme === 'dark' ? 'rgba(192, 192, 192, 0.08)' : 'rgba(100, 100, 100, 0.06)'} 
      />
      <FloatingOrb 
        delay={5} 
        duration={14} 
        size={180} 
        left="45%" 
        top="75%" 
        color={theme === 'dark' ? 'rgba(196, 163, 90, 0.06)' : 'rgba(13, 148, 136, 0.05)'} 
      />
      
      {/* Animated gradient overlay */}
      <motion.div
        animate={{
          background: theme === 'dark' ? [
            'radial-gradient(ellipse at 80% 20%, rgba(196, 163, 90, 0.04) 0%, transparent 50%)',
            'radial-gradient(ellipse at 20% 80%, rgba(196, 163, 90, 0.04) 0%, transparent 50%)',
            'radial-gradient(ellipse at 80% 20%, rgba(196, 163, 90, 0.04) 0%, transparent 50%)',
          ] : [
            'radial-gradient(ellipse at 80% 20%, rgba(13, 148, 136, 0.03) 0%, transparent 50%)',
            'radial-gradient(ellipse at 20% 80%, rgba(13, 148, 136, 0.03) 0%, transparent 50%)',
            'radial-gradient(ellipse at 80% 20%, rgba(13, 148, 136, 0.03) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        variants={sectionViewportVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: sectionViewportConfig.amount, margin: sectionViewportConfig.margin }}
        style={{ maxWidth: 1100, width: '100%', opacity, position: 'relative', zIndex: 1 }}
      >
        {/* Header */}
        <motion.div
          variants={createVariants('left', 80)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{ marginBottom: '40px' }}
        >
          <span style={{
            fontSize: '12px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: theme === 'dark' ? 'rgba(196, 163, 90, 0.6)' : 'rgba(168, 85, 247, 0.8)',
            display: 'block',
            marginBottom: '12px',
          }}>
            Projects
          </span>
          <h2 style={{
            fontSize: 'clamp(32px, 6vw, 56px)',
            fontWeight: 200,
            color: colors.text,
            margin: 0,
            lineHeight: 1.1,
          }}>
            Selected work
          </h2>
        </motion.div>

        {/* Projects grid - 2x2 */}
        <motion.div
          className="projects-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gap: '20px',
          }}
        >
          {projects.map((project, index) => (
            <TiltCard key={project.title}>
              <motion.div
                variants={createVariants(index % 2 === 0 ? 'left' : 'right', 60)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="project-card"
                style={{
                  padding: 'clamp(16px, 3vw, 24px)',
                  borderRadius: '16px',
                  boxSizing: 'border-box',
                  background: hoveredIndex === index 
                    ? project.gradient
                    : theme === 'dark'
                      ? 'linear-gradient(145deg, rgba(196, 163, 90, 0.04) 0%, rgba(192, 192, 192, 0.02) 100%)'
                      : 'linear-gradient(145deg, rgba(168, 85, 247, 0.08) 0%, rgba(34, 211, 238, 0.04) 100%)',
                  border: hoveredIndex === index 
                    ? theme === 'dark'
                      ? '1px solid rgba(196, 163, 90, 0.3)'
                      : '1px solid rgba(168, 85, 247, 0.35)'
                    : theme === 'dark'
                      ? '1px solid rgba(196, 163, 90, 0.1)'
                      : '1px solid rgba(168, 85, 247, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                  boxShadow: 'none',
                }}
              >
                {/* Shine effect */}
                <motion.div
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={{ 
                    x: hoveredIndex === index ? '200%' : '-100%',
                    opacity: hoveredIndex === index ? 0.2 : 0 
                  }}
                  transition={{ duration: 0.6 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '50%',
                    height: '100%',
                    background: theme === 'dark' 
                      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
                      : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
                    transform: 'skewX(-20deg)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '3px', background: colors.gold }} />
                    <span style={{
                      fontSize: '11px',
                      color: colors.silver,
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                    }}>
                      {project.category}
                    </span>
                  </div>
                  {project.highlight && (
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: theme === 'dark' ? 'rgba(196, 163, 90, 0.25)' : 'rgba(168, 85, 247, 0.25)',
                      border: theme === 'dark' 
                        ? '1px solid rgba(196, 163, 90, 0.4)'
                        : '1px solid rgba(168, 85, 247, 0.4)',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: colors.gold,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}>
                      {project.highlight}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: 'clamp(18px, 3vw, 22px)',
                  fontWeight: 500,
                  color: hoveredIndex === index 
                    ? (theme === 'dark' ? '#fff' : '#111')
                    : colors.text,
                  margin: '0 0 8px 0',
                  transition: 'color 0.3s ease',
                }}>
                  {project.title}
                </h3>

                {/* Description */}
                <p style={{
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: colors.textMuted,
                  margin: '0 0 16px 0',
                }}>
                  {project.description}
                </p>

                {/* Tech stack */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '16px',
                }}>
                  {project.tech.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        background: theme === 'dark' ? 'rgba(196, 163, 90, 0.2)' : 'rgba(13, 148, 136, 0.2)',
                        border: theme === 'dark' 
                          ? '1px solid rgba(196, 163, 90, 0.3)'
                          : '1px solid rgba(13, 148, 136, 0.3)',
                        fontSize: '12px',
                        color: colors.gold,
                        letterSpacing: '0.3px',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      fontSize: '12px',
                      color: colors.textMuted,
                    }}>
                      +{project.tech.length - 3}
                    </span>
                  )}
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: '16px' }}>
                  <motion.a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 2 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      fontSize: '13px',
                      color: colors.silver,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    GitHub →
                  </motion.a>
                  {project.links.live && (
                    <motion.a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 2 }}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontSize: '13px',
                        color: colors.gold,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Live ↗
                    </motion.a>
                  )}
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </motion.div>
      </motion.div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
