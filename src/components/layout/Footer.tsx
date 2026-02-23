'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer
      style={{
        padding: 'clamp(32px, 6vw, 48px) clamp(16px, 4vw, 24px)',
        paddingBottom: 'clamp(80px, 15vw, 48px)', // Extra padding for mobile nav
        borderTop: '1px solid rgba(196, 163, 90, 0.1)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'clamp(16px, 3vw, 20px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ flex: '1 1 auto', minWidth: '200px' }}
        >
          <span
            style={{
              fontSize: 'clamp(10px, 2vw, 12px)',
              color: 'rgba(255, 255, 255, 0.4)',
              letterSpacing: '0.5px',
            }}
          >
            © 2026 Ayaan Izhar. All rights reserved.
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{
            display: 'flex',
            gap: 'clamp(16px, 3vw, 24px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { name: 'GitHub', href: 'https://github.com/AI-20-CO' },
            { name: 'LinkedIn', href: 'https://www.linkedin.com/in/ayaan-izhar-8293b8371/' },
            { name: 'Email', href: 'mailto:ayaan.izhar01@gmail.com' },
          ].map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.name !== 'Email' ? '_blank' : undefined}
              rel={link.name !== 'Email' ? 'noopener noreferrer' : undefined}
              style={{
                fontSize: 'clamp(10px, 2vw, 12px)',
                color: 'rgba(196, 163, 90, 0.6)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                letterSpacing: '0.5px',
              }}
              className="interactive"
            >
              {link.name}
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hide-mobile"
          style={{ flex: '1 1 auto', minWidth: '150px', textAlign: 'right' }}
        >
          <span
            style={{
              fontSize: 'clamp(10px, 2vw, 12px)',
              color: 'rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.5px',
            }}
          >
            Built with Next.js
          </span>
        </motion.div>
      </div>
    </footer>
  );
}