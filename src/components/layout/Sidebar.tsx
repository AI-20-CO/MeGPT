'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

// Modern SVG icons
const icons = {
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  about: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  ),
  skills: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  experience: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  projects: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  ),
  contact: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  sun: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  moon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
};

const navItems = [
  { label: 'Home', href: '#home', icon: icons.home },
  { label: 'About', href: '#about', icon: icons.about },
  { label: 'Skills', href: '#skills', icon: icons.skills },
  { label: 'Experience', href: '#experience', icon: icons.experience },
  { label: 'Projects', href: '#projects', icon: icons.projects },
  { label: 'Contact', href: '#contact', icon: icons.contact },
];

// Mobile nav items - 5 items for bottom nav
const mobileNavItems = [
  { label: 'Home', href: '#home', icon: icons.home },
  { label: 'About', href: '#about', icon: icons.about },
  { label: 'Skills', href: '#skills', icon: icons.skills },
  { label: 'Projects', href: '#projects', icon: icons.projects },
  { label: 'Contact', href: '#contact', icon: icons.contact },
];

export default function Sidebar() {
  const { theme, toggleTheme, colors } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Track active section
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.replace('#', ''));
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className="desktop-sidebar"
          style={{
            position: 'fixed',
            left: '20px',
            top: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            zIndex: 9999,
          }}
        >
          <motion.div
            animate={{ width: isExpanded ? 150 : 60 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              padding: '12px 8px',
              borderRadius: '16px',
              background: theme === 'dark' 
                ? 'linear-gradient(145deg, rgba(30, 30, 35, 0.95) 0%, rgba(25, 25, 30, 0.9) 100%)'
                : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 245, 245, 0.9) 100%)',
              border: theme === 'dark'
                ? '1px solid rgba(196, 163, 90, 0.15)'
                : '1px solid rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(20px)',
              boxShadow: theme === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              overflow: 'hidden',
              transition: 'background 0.3s ease, border 0.3s ease, box-shadow 0.3s ease',
            }}
          >
            {navItems.map((item, index) => {
              const isActive = activeSection === item.href.replace('#', '');
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: isActive ? colors.gold : hoveredIndex === index ? colors.gold : colors.textMuted,
                    textDecoration: 'none',
                    letterSpacing: '0.3px',
                    transition: 'color 0.2s ease, background 0.2s ease',
                    background: isActive 
                      ? `${colors.gold}20` 
                      : hoveredIndex === index 
                        ? `${colors.gold}15` 
                        : 'transparent',
                    whiteSpace: 'nowrap',
                  }}
                  className="interactive"
                  whileHover={{ x: isExpanded ? 2 : 0 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '20px',
                      width: '20px',
                      flexShrink: 0,
                      color: isActive || hoveredIndex === index ? colors.gold : colors.textMuted,
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {item.icon}
                  </span>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden' }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.a>
              );
            })}
            
            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '12px',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 500,
                color: colors.gold,
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.3px',
                transition: 'background 0.2s ease',
                background: `${colors.gold}10`,
                marginTop: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              <motion.span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '20px',
                  width: '20px',
                  flexShrink: 0,
                  color: colors.gold,
                }}
                animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? icons.sun : icons.moon}
              </motion.span>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    {theme === 'dark' ? 'Light' : 'Dark'}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </motion.nav>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <motion.nav
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mobile-nav"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            padding: '8px 12px',
            paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
            background: theme === 'dark'
              ? 'linear-gradient(to top, rgba(10, 10, 10, 0.98) 0%, rgba(10, 10, 10, 0.95) 100%)'
              : 'linear-gradient(to top, rgba(250, 250, 250, 0.98) 0%, rgba(250, 250, 250, 0.95) 100%)',
            borderTop: theme === 'dark'
              ? '1px solid rgba(196, 163, 90, 0.15)'
              : '1px solid rgba(0, 0, 0, 0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            transition: 'background 0.3s ease, border 0.3s ease',
          }}
        >
          {mobileNavItems.map((item) => {
            const isActive = activeSection === item.href.replace('#', '');
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  background: isActive ? `${colors.gold}15` : 'transparent',
                  minWidth: '52px',
                }}
              >
                <span
                  style={{
                    color: isActive ? colors.gold : colors.textMuted,
                    transition: 'color 0.2s ease',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 500,
                    color: isActive ? colors.gold : colors.textMuted,
                    letterSpacing: '0.3px',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item.label}
                </span>
              </a>
            );
          })}
          
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 12px',
              borderRadius: '12px',
              border: 'none',
              background: `${colors.gold}15`,
              cursor: 'pointer',
              minWidth: '52px',
            }}
          >
            <span style={{ color: colors.gold }}>
              {theme === 'dark' ? icons.sun : icons.moon}
            </span>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 500,
                color: colors.gold,
                letterSpacing: '0.3px',
              }}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </span>
          </button>
        </motion.nav>
      )}
    </>
  );
}
