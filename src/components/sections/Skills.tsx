'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { FloatingOrb } from '@/components/ui';
import { createVariants, containerVariants, sectionViewportVariants, sectionViewportConfig } from '@/utils/animations';

// Theme-aware skill category colors
const getSkillCategories = (isDark: boolean) => [
  {
    title: 'Languages',
    color: isDark ? '#c4a35a' : '#a855f7',
    skills: [
      { name: 'Java', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Python', level: 95 },
      { name: 'SQL', level: 85 },
    ],
  },
  {
    title: 'Frontend',
    color: isDark ? '#61dafb' : '#22d3ee',
    skills: [
      { name: 'React', level: 92 },
      { name: 'Next.js', level: 88 },
      { name: 'React Native', level: 85 },
      { name: 'Tailwind', level: 90 },
    ],
  },
  {
    title: 'Backend',
    color: isDark ? '#a8c4a0' : '#4ade80',
    skills: [
      { name: 'Spring Boot', level: 90 },
      { name: 'FastAPI', level: 80 },
      { name: 'Node.js', level: 85 },
      { name: 'REST APIs', level: 92 },
    ],
  },
  {
    title: 'Java Enterprise',
    color: isDark ? '#e57373' : '#f472b6',
    skills: [
      { name: 'OSGi', level: 85 },
      { name: 'Hibernate', level: 88 },
      { name: 'JPA', level: 90 },
      { name: 'JAX-RS', level: 85 },
    ],
  },
  {
    title: 'Cloud & DevOps',
    color: isDark ? '#a0b4c4' : '#818cf8',
    skills: [
      { name: 'AWS', level: 85 },
      { name: 'Docker', level: 88 },
      { name: 'Kubernetes', level: 75 },
      { name: 'CI/CD', level: 85 },
    ],
  },
  {
    title: 'Databases',
    color: isDark ? '#c4a0b4' : '#e879f9',
    skills: [
      { name: 'PostgreSQL', level: 90 },
      { name: 'MongoDB', level: 82 },
      { name: 'Redis', level: 78 },
      { name: 'MySQL', level: 88 },
    ],
  },
  {
    title: 'ML & Data',
    color: isDark ? '#f7931e' : '#fb923c',
    skills: [
      { name: 'PyTorch', level: 75 },
      { name: 'Scikit-learn', level: 80 },
      { name: 'Pandas', level: 85 },
      { name: 'OpenAI API', level: 82 },
    ],
  },
];

// Theme-aware segregated technologies
const getSegregatedTechnologies = (isDark: boolean) => [
  { category: 'Languages', techs: ['Java', 'TypeScript', 'JavaScript', 'Python', 'SQL', 'C++'], color: isDark ? '#c4a35a' : '#a855f7' },
  { category: 'Frontend', techs: ['React', 'Next.js', 'React Native', 'Tailwind CSS', 'HTML5', 'CSS3'], color: isDark ? '#61dafb' : '#22d3ee' },
  { category: 'Backend', techs: ['Spring Boot', 'FastAPI', 'Node.js', 'Express', 'REST APIs', 'GraphQL'], color: isDark ? '#a8c4a0' : '#4ade80' },
  { category: 'Java Enterprise', techs: ['OSGi', 'Hibernate', 'JPA', 'JAX-RS', 'Maven', 'Gradle'], color: isDark ? '#e57373' : '#f472b6' },
  { category: 'Cloud & DevOps', techs: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Linux'], color: isDark ? '#a0b4c4' : '#818cf8' },
  { category: 'Databases', techs: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'DynamoDB'], color: isDark ? '#c4a0b4' : '#e879f9' },
  { category: 'ML & Data', techs: ['PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'OpenAI API'], color: isDark ? '#f7931e' : '#fb923c' },
];

// Skill bar component - larger fonts
function SkillBar({ name, level, delay, color, isInView, colors }: { 
  name: string; 
  level: number; 
  delay: number; 
  color: string;
  isInView: boolean;
  colors: { text: string; textMuted: string };
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ marginBottom: '16px' }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
      }}>
        <span style={{
          fontSize: 'clamp(14px, 2.5vw, 15px)',
          fontWeight: 400,
          color: isHovered ? color : colors.text,
          transition: 'color 0.3s ease',
        }}>
          {name}
        </span>
        <span style={{
          fontSize: 'clamp(13px, 2vw, 14px)',
          color: colors.textMuted,
          fontWeight: 300,
        }}>
          {level}%
        </span>
      </div>
      <div style={{
        height: '4px',
        borderRadius: '2px',
        background: 'rgba(255, 255, 255, 0.15)',
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay: delay + 0.2, ease: [0.4, 0, 0.2, 1] }}
          style={{
            height: '100%',
            borderRadius: '2px',
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            boxShadow: isHovered ? `0 0 12px ${color}60` : 'none',
            transition: 'box-shadow 0.3s ease',
          }}
        />
      </div>
    </motion.div>
  );
}

// Technology tag with hover effect - larger fonts
function TechTag({ tech, color, index, isInView }: { tech: string; color: string; index: number; isInView: boolean }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ 
        scale: 1.08,
        background: `${color}25`,
        borderColor: color,
      }}
      style={{
        display: 'inline-block',
        padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 14px)',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        fontSize: 'clamp(12px, 2vw, 13px)',
        color: 'rgba(255, 255, 255, 0.9)',
        cursor: 'default',
        transition: 'all 0.3s ease',
      }}
    >
      {tech}
    </motion.span>
  );
}

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.35 });
  const [activeCategory, setActiveCategory] = useState(0);
  const { theme, colors } = useTheme();
  
  // Get theme-aware categories
  const isDark = theme === 'dark';
  const skillCategories = getSkillCategories(isDark);
  const segregatedTechnologies = getSegregatedTechnologies(isDark);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);

  return (
    <section
      id="skills"
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
        delay={0} 
        duration={8} 
        size={300} 
        left="5%" 
        top="15%" 
        color={theme === 'dark' ? 'rgba(196, 163, 90, 0.12)' : 'rgba(13, 148, 136, 0.09)'} 
      />
      <FloatingOrb 
        delay={2} 
        duration={10} 
        size={200} 
        left="85%" 
        top="65%" 
        color={theme === 'dark' ? 'rgba(192, 192, 192, 0.08)' : 'rgba(100, 100, 100, 0.06)'} 
      />
      <FloatingOrb 
        delay={4} 
        duration={12} 
        size={250} 
        left="60%" 
        top="80%" 
        color={theme === 'dark' ? 'rgba(196, 163, 90, 0.06)' : 'rgba(13, 148, 136, 0.05)'} 
      />
      
      {/* Animated gradient overlay */}
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
      
      <motion.div
        variants={sectionViewportVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: sectionViewportConfig.amount, margin: sectionViewportConfig.margin }}
        style={{ maxWidth: 1200, width: '100%', opacity, position: 'relative', zIndex: 1 }}
      >
        {/* Header - animates from left */}
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
            Tech Stack
          </span>
          <h2 style={{
            fontSize: 'clamp(32px, 6vw, 56px)',
            fontWeight: 200,
            color: colors.text,
            margin: 0,
            lineHeight: 1.1,
          }}>
            Skills & expertise
          </h2>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          variants={createVariants('right', 60)}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="hide-scrollbar"
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '32px',
            flexWrap: 'nowrap',
            overflowX: 'auto',
            paddingBottom: '8px',
          }}
        >
          {skillCategories.map((category, index) => (
            <motion.button
              key={category.title}
              onClick={() => setActiveCategory(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="skill-category-btn"
              style={{
                padding: 'clamp(8px, 1.5vw, 10px) clamp(14px, 3vw, 18px)',
                borderRadius: '8px',
                border: activeCategory === index 
                  ? `1px solid ${category.color}` 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                background: activeCategory === index 
                  ? `${category.color}15` 
                  : 'transparent',
                color: activeCategory === index 
                  ? category.color 
                  : colors.textMuted,
                fontSize: 'clamp(13px, 2.5vw, 14px)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxSizing: 'border-box',
              }}
              data-category-color={category.color}
              data-active={activeCategory === index}
            >
              {category.title}
            </motion.button>
          ))}
        </motion.div>

        {/* Main content grid */}
        <motion.div 
          className="skills-grid" 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
            gap: 'clamp(16px, 3vw, 24px)',
            alignItems: 'stretch',
          }}
        >
          {/* Skill bars - Selected category */}
          <motion.div
            key={activeCategory}
            variants={createVariants('left', 50)}
            style={{
              padding: 'clamp(20px, 4vw, 28px)',
              borderRadius: '20px',
              background: theme === 'dark'
                ? 'linear-gradient(145deg, rgba(196, 163, 90, 0.04) 0%, rgba(192, 192, 192, 0.02) 100%)'
                : 'linear-gradient(145deg, rgba(168, 85, 247, 0.08) 0%, rgba(34, 211, 238, 0.04) 100%)',
              border: theme === 'dark'
                ? '1px solid rgba(196, 163, 90, 0.1)'
                : '1px solid rgba(168, 85, 247, 0.2)',
              boxShadow: 'none',
            }}
          >
            <h3 style={{
              fontSize: 'clamp(18px, 4vw, 22px)',
              fontWeight: 500,
              color: skillCategories[activeCategory].color,
              marginBottom: '24px',
            }}>
              {skillCategories[activeCategory].title}
            </h3>
            <div>
              {skillCategories[activeCategory].skills.map((skill, index) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  delay={index * 0.08}
                  color={skillCategories[activeCategory].color}
                  isInView={isInView}
                  colors={{ text: colors.text, textMuted: colors.textMuted }}
                />
              ))}
            </div>
          </motion.div>

          {/* All Technologies - Scrollable with fade */}
          <motion.div
            variants={createVariants('right', 50)}
            style={{
              padding: 'clamp(20px, 4vw, 28px)',
              borderRadius: '20px',
              background: theme === 'dark'
                ? 'linear-gradient(145deg, rgba(192, 192, 192, 0.04) 0%, rgba(196, 163, 90, 0.02) 100%)'
                : 'linear-gradient(145deg, rgba(100, 100, 100, 0.05) 0%, rgba(13, 148, 136, 0.03) 100%)',
              border: theme === 'dark'
                ? '1px solid rgba(192, 192, 192, 0.1)'
                : '1px solid rgba(100, 100, 100, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 'clamp(400px, 60vh, 600px)',
              boxShadow: 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <h3 style={{
              fontSize: 'clamp(18px, 4vw, 22px)',
              fontWeight: 500,
              color: colors.text,
              marginBottom: '20px',
              flexShrink: 0,
            }}>
              All Technologies
            </h3>
            
            {/* Fade overlay at top */}
            <div style={{
              position: 'absolute',
              top: '60px',
              left: 0,
              right: 0,
              height: '20px',
              background: 'linear-gradient(to bottom, rgba(25, 25, 30, 0.8), transparent)',
              pointerEvents: 'none',
              zIndex: 1,
            }} />
            
            {/* Fade overlay at bottom */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40px',
              background: 'linear-gradient(to top, rgba(25, 25, 30, 0.95), transparent)',
              pointerEvents: 'none',
              zIndex: 1,
            }} />
            
            <div
              className="tech-scroll"
              data-lenis-prevent="true"
              style={{
                flex: 1,
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                paddingRight: '8px',
                paddingBottom: '20px',
              }}
            >
              {segregatedTechnologies.map((group, groupIndex) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
                >
                  <div style={{
                    fontSize: '11px',
                    color: group.color,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                    fontWeight: 600,
                  }}>
                    {group.category}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {group.techs.map((tech, index) => (
                      <TechTag 
                        key={tech} 
                        tech={tech} 
                        color={group.color} 
                        index={index} 
                        isInView={isInView}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        /* Custom thin scrollbar for tech scroll */
        .tech-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .tech-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .tech-scroll::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? 'rgba(196, 163, 90, 0.3)' : 'rgba(13, 148, 136, 0.3)'};
          border-radius: 4px;
        }
        .tech-scroll::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? 'rgba(196, 163, 90, 0.5)' : 'rgba(13, 148, 136, 0.5)'};
        }
        .tech-scroll {
          scrollbar-width: thin;
          scrollbar-color: ${theme === 'dark' ? 'rgba(196, 163, 90, 0.3) transparent' : 'rgba(13, 148, 136, 0.3) transparent'};
        }
        
        /* Skill category button hover effects */
        .skill-category-btn {
          position: relative;
          outline: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .skill-category-btn:hover {
          border: 1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)'} !important;
          box-shadow: ${theme === 'dark' 
            ? '0 0 0 1px rgba(255, 255, 255, 0.1) inset' 
            : '0 0 0 1px rgba(0, 0, 0, 0.05) inset'};
        }
        
        .skill-category-btn[data-active="true"]:hover {
          opacity: 0.95;
          border-width: 1px !important;
        }
        
        @media (max-width: 768px) {
          .skills-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
