# Askfolio

Ask me about myself, about my skills, about my achievements.

## Portfolio Website

A modern, interactive portfolio website built with Next.js 16, featuring WebGL effects, smooth animations, and a beautiful UI with dark/light theme support.

## Features

- **Dark/Light Theme** - Seamless theme switching with custom color schemes (Gold/Silver in dark, Purple/Cyan in light)
- **WebGL Effects** - Interactive orb visualization using OGL library with GLSL shaders
- **Hyperspeed Background** - Three.js powered highway animation with bloom effects
- **Smooth Animations** - Framer Motion powered scroll and transition animations
- **Interactive UI** - Custom fluid cursor and engaging hover interactions
- **Fully Responsive** - Optimized for all devices (360px - 4K+)
- **Fast Performance** - Built with Next.js 16 and Turbopack
- **Type-Safe** - Written in TypeScript with strict types
- **Zero Vulnerabilities** - All dependencies security audited

## Tech Stack

- **Framework:** Next.js 16.1.6 (Turbopack)
- **Language:** TypeScript 5.x
- **3D/WebGL:** Three.js, OGL, Postprocessing
- **Animations:** Framer Motion 12.x
- **Styling:** CSS-in-JS with CSS Custom Properties
- **Font:** Inter (Google Fonts)

##  Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── favicon.ico
│   │   ├── globals.css         # Global styles + responsive breakpoints
│   │   ├── layout.tsx          # Root layout with providers
│   │   └── page.tsx            # Home page
│   │
│   ├── components/             # React components
│   │   ├── sections/           # Page sections
│   │   │   ├── Hero.tsx        # Landing with WebGL orbs
│   │   │   ├── About.tsx       # Personal information
│   │   │   ├── Skills.tsx      # Technical skills showcase
│   │   │   ├── Experience.tsx  # Work experience timeline
│   │   │   ├── Projects.tsx    # Portfolio projects gallery
│   │   │   ├── Contact.tsx     # Contact information
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/             # Layout components
│   │   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   │   └── index.ts
│   │   │
│   │   └── ui/                 # Reusable UI components
│   │       ├── FluidCursor.tsx # Custom cursor effect
│   │       ├── FloatingOrb.tsx # Floating orb component
│   │       ├── Hyperspeed.tsx  # Three.js highway animation
│   │       ├── LoadingScreen.tsx
│   │       ├── Orb.tsx         # WebGL orb with GLSL shaders
│   │       └── index.ts
│   │
│   ├── config/                 # Configuration
│   │   ├── theme.ts            # Theme colors, animation, breakpoints
│   │   ├── site.ts             # Site configuration
│   │   └── index.ts
│   │
│   ├── context/                # React Context providers
│   │   ├── ThemeContext.tsx    # Theme state management
│   │   └── index.ts
│   │
│   ├── hooks/                  # Custom React hooks (placeholder)
│   │   └── index.ts
│   │
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   │
│   └── utils/                  # Utility functions
│       ├── animations.ts       # Framer Motion animation presets
│       └── index.ts
│
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
└── README.md
```

##  Sections

- **Hero** - Landing section with animated text
- **About** - Personal information and background
- **Skills** - Technical skills showcase
- **Experience** - Work experience timeline
- **Projects** - Portfolio projects gallery
- **Contact** - Contact information and links

##  License

This project is licensed under the MIT License.

##  Author

**Ayaan Izhar**
- Portfolio: [Your Website URL]
- GitHub: [@AI-20-CO](https://github.com/AI-20-CO)
- LinkedIn: [ayaan-izhar](https://linkedin.com/in/ayaan-izhar)

