/**
 * Site-wide constants and configuration
 */

// Personal information
export const SITE_CONFIG = {
  name: 'Ayaan Izhar',
  title: 'Software Engineer',
  email: 'ayaan.izhar01@gmail.com',
  phone: '+60 10-430 1423',
  location: 'Kuala Lumpur, Malaysia',
  github: 'https://github.com/AI-20-CO',
  linkedin: 'https://linkedin.com/in/ayaan-izhar',
} as const;

// Navigation items
export const NAV_SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
] as const;

// SEO configuration
export const SEO = {
  title: 'Ayaan Izhar | Software Engineer',
  description: 'Software Engineer crafting scalable solutions and modern experiences. Currently at Experian PLC.',
  keywords: [
    'Software Engineer',
    'Full Stack Developer',
    'React',
    'Next.js',
    'TypeScript',
    'Java',
    'Spring Boot',
  ],
} as const;
