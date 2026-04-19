'use client';

import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
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

// 3D Tilt Card Component - hover weighted effect
function TiltCard({ children, disabled = false }: { children: React.ReactNode; disabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Spring for smooth tilt response
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg']);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled) return;
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      x.set((e.clientX - rect.left) / rect.width - 0.5);
      y.set((e.clientY - rect.top) / rect.height - 0.5);
    }
  };

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={disabled ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2 });
  const [isMobile, setIsMobile] = useState(false);
  const { theme, colors } = useTheme();

  useEffect(() => {
    // Check for touch device OR small screen
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    setIsMobile(isTouchDevice || window.innerWidth <= 768);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Use spring to smooth out scroll-based opacity (prevents jank)
  // More gradual fade values for smoother aesthetic transitions
  const opacityRaw = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], isMobile ? [1, 1, 1, 1] : [0.4, 1, 1, 0.4]);
  const opacity = useSpring(opacityRaw, { stiffness: 80, damping: 25, restDelta: 0.001 });

  return (
    <section
      id="projects"
      ref={ref}
      style={{
        minHeight: '100dvh',
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
      
      {/* Animated gradient overlay - disabled on mobile */}
      {!isMobile && (
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
      )}

      <motion.div
        variants={sectionViewportVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: sectionViewportConfig.amount, margin: sectionViewportConfig.margin }}
        style={{ maxWidth: 1100, width: '100%', opacity, position: 'relative', zIndex: 1 }}
      >
        {/* Header */}
        <motion.div
          variants={createVariants('left', 60)}
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
              fontFamily: 'var(--font-syncopate), sans-serif',
              fontSize: 'clamp(24px, 4vw, 42px)',
              fontWeight: 400,
              textTransform: 'uppercase',
              color: colors.text,
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: '1px',
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
            <TiltCard key={project.title} disabled={isMobile}>
              <motion.div
                variants={createVariants(index % 2 === 0 ? 'left' : 'right', 50)}
                whileHover={isMobile ? {} : { scale: 1.02, y: -6 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="project-card"
                data-theme={theme}
                style={{
                  padding: 'clamp(16px, 3vw, 24px)',
                  borderRadius: '16px',
                  boxSizing: 'border-box',
                  background: theme === 'dark'
                    ? 'linear-gradient(145deg, rgba(196, 163, 90, 0.04) 0%, rgba(192, 192, 192, 0.02) 100%)'
                    : 'linear-gradient(145deg, rgba(168, 85, 247, 0.08) 0%, rgba(34, 211, 238, 0.04) 100%)',
                  border: theme === 'dark'
                    ? '1px solid rgba(196, 163, 90, 0.1)'
                    : '1px solid rgba(168, 85, 247, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  // @ts-expect-error CSS custom property
                  '--hover-gradient': project.gradient,
                }}
              >
                {/* Shine effect - CSS only */}
                <div className="card-shine" />

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
                <h3 className="project-title" style={{
                  fontFamily: 'var(--font-syncopate)',
                  textTransform: 'uppercase',
                  fontSize: 'clamp(15px, 2.5vw, 18px)',
                  fontWeight: 500,
                  color: colors.text,
                  margin: '0 0 8px 0',
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
        .project-card {
          transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .project-card:hover {
          background: var(--hover-gradient) !important;
        }
        .project-card[data-theme="dark"]:hover {
          border-color: rgba(196, 163, 90, 0.3) !important;
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.4), 0 8px 16px -8px rgba(196, 163, 90, 0.15);
        }
        .project-card[data-theme="light"]:hover {
          border-color: rgba(168, 85, 247, 0.35) !important;
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 8px 16px -8px rgba(168, 85, 247, 0.1);
        }
        .project-card[data-theme="dark"]:hover .project-title {
          color: #fff;
        }
        .project-card[data-theme="light"]:hover .project-title {
          color: #111;
        }
        .project-title {
          transition: color 0.3s ease;
        }
        .card-shine {
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
          transform: translateX(-100%) skewX(-20deg);
          pointer-events: none;
          transition: transform 0.6s ease;
        }
        .project-card:hover .card-shine {
          transform: translateX(300%) skewX(-20deg);
        }
        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
