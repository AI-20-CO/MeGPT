# Askfolio

Ask me about myself, about my skills, about my achievements.

## Portfolio Website

A modern, interactive portfolio website built with Next.js 15, featuring smooth animations, dark/light theme, and a beautiful UI.

## Features

-  **Dark/Light Theme** - Seamless theme switching with custom color schemes
-  **Smooth Animations** - Framer Motion powered scroll animations
-  **Interactive UI** - Custom fluid cursor and engaging interactions
-  **Fully Responsive** - Optimized for all device sizes
-  **Fast Performance** - Built with Next.js 15 and Turbopack
-  **Type-Safe** - Written in TypeScript

## Tech Stack

- **Framework:** Next.js 15.4.6
- **Language:** TypeScript
- **Styling:** CSS-in-JS with Framer Motion
- **Animations:** Framer Motion
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
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   │
│   ├── components/             # React components
│   │   ├── sections/           # Page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── layout/             # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── FluidCursor.tsx
│   │   │   ├── LoadingScreen.tsx
│   │   │   ├── SectionTransition.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts            # Barrel export
│   │
│   ├── config/                 # Configuration
│   │   ├── theme.ts            # Theme colors & constants
│   │   ├── site.ts             # Site configuration
│   │   └── index.ts
│   │
│   ├── context/                # React Context providers
│   │   ├── ThemeContext.tsx
│   │   └── index.ts
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useSectionTransition.ts
│   │   └── index.ts
│   │
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   │
│   └── utils/                  # Utility functions
│       ├── animations.ts       # Animation helpers
│       └── index.ts
│
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
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

