# CLAUDE.md — Portfolio Project Guide

> Source of truth for working in this repo. Read this before touching code.

## 1. What this project is

A personal portfolio for Ayaan Izhar with an AI "Ask" experience.

- **Frontend** — Next.js 16.1.6 (App Router, Turbopack), React 19.1.0, TypeScript strict, Tailwind v4, Framer Motion, Three.js + OGL (WebGL backgrounds).
- **Backend** — FastAPI + LangChain + Groq (`llama-3.3-70b-versatile`). Knowledge sourced from a single YAML file. No database.
- **Deployment** — Frontend on Vercel (Speed Insights wired in). Backend deployable to Render/Railway/Fly.
- **Branch model** — `main` is production; feature branches use `WPA-XX-<slug>` (current: `WPA-01-Ask-Functionality`).

## 2. Repository layout

```
portfolio/
├── src/
│   ├── app/                  # Next.js App Router (layout.tsx, page.tsx, globals.css)
│   ├── components/
│   │   ├── sections/         # Hero, About, Skills, Experience, Projects, Contact, ChatLanding
│   │   ├── ui/               # Hyperspeed (Three.js), Orb (OGL), FluidCursor, FloatingOrb, LoadingScreen
│   │   └── layout/           # Sidebar
│   ├── config/               # theme.ts (DARK_COLORS, LIGHT_COLORS)
│   ├── context/              # ThemeContext (memoized provider)
│   ├── types/                # Shared TS types (Theme, ThemeColors, ThemeContextType)
│   └── utils/                # animations.ts and barrel exports
├── backend/
│   ├── main.py               # FastAPI app, CORS, /api/chat, /api/health, /api/suggestions
│   ├── knowledge.yaml        # Personal data + assistant_rules + SecretCode
│   ├── requirements.txt
│   └── .env                  # GROQ_API_KEY (gitignored)
├── public/                   # Static assets (favicon)
├── .claude/                  # Project skills + hooks (this folder)
└── CLAUDE.md                 # You are here
```

Path alias: `@/*` → `src/*`.

## 3. How the pieces talk

- `src/app/page.tsx` is a client component. It wraps `<MainContent />` in `<ThemeProvider>`, lazy-loads `Hyperspeed` and `FluidCursor` with `dynamic({ ssr: false })`, gates them behind a 100 ms hydration delay, and stacks sections: `ChatLanding → Hero → About → Skills → Experience → Projects → Contact`.
- `ChatLanding` POSTs `{ message, history: messages.slice(-10) }` to `${NEXT_PUBLIC_CHAT_API_URL}/api/chat`. Backend prompt is built once at boot from `knowledge.yaml`; system prompt + last 10 messages flow through a LangChain `prompt | llm` chain to Groq.
- The backend has zero database; it's an LLM facade over a YAML knowledge base + a hardcoded `SecretCode` short-circuit.

## 4. Environment variables

| Var | Side | Required | Default |
|---|---|---|---|
| `NEXT_PUBLIC_CHAT_API_URL` | frontend | yes (prod) | `http://localhost:8000` |
| `GROQ_API_KEY` | backend | yes | — |
| `ALLOWED_ORIGINS` | backend | no | merged into `DEFAULT_ALLOWED_ORIGINS` (comma-separated) |

`.env` and `backend/.env` are gitignored — keep it that way. If a key was ever committed, rotate it.

## 5. Run / build / lint

```bash
# Frontend (port 3000)
npm install
npm run dev          # Turbopack
npm run build        # next build (production check)
npm run lint         # next lint (ESLint flat config)

# Backend (port 8000)
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Before pushing: `npm run lint && npm run build` must pass. There is currently no test suite — don't claim a change is "tested" unless you've actually loaded the page and exercised the flow.

## 6. Conventions — DO

- **Strict TypeScript.** No `any`. Prefer `readonly` on props and discriminated unions over optional fields.
- **Functional components only.** Hooks for state; `useCallback` / `useMemo` only when the value crosses a boundary (context value, list keys, expensive compute). Don't sprinkle them defensively.
- **Lazy-load anything WebGL or > 50 kB gzip.** `Hyperspeed`, `Orb`, `FluidCursor` are already `dynamic({ ssr: false })` — keep new heavy components on that pattern.
- **Mobile branch early.** Read `window.innerWidth <= 768` (or `matchMedia('(pointer: coarse)')`) inside a `useEffect`, store in state, then short-circuit expensive effects (mouse tracking, parallax orbs, custom cursor) on mobile.
- **Use `clamp(min, vw, max)`** for fluid type/spacing. Tailwind breakpoints map to `389 / 480 / 768 / 1024 / 1280 / 1512`.
- **`rel="noopener noreferrer"` + `target="_blank"`** on every external anchor. Already followed in `Projects.tsx`.
- **Imports through barrel files.** `@/components/sections`, `@/components/ui`, `@/context`, `@/config`, `@/types`. Add new exports to the matching `index.ts`.
- **Theme via `useTheme()` only.** Never read `localStorage.theme` directly inside a component — go through context.
- **Backend: `yaml.safe_load` only.** Never `yaml.load`.
- **Backend: validate inputs with Pydantic.** Add `Field(..., max_length=...)` to user-facing strings; today `ChatRequest.message` is unbounded — fix when you touch it.
- **Pin Python deps with `==`** in `requirements.txt` (already the convention).
- **Commit style** — `WPA-XX <Capitalized short summary>` matching existing log.

## 7. Conventions — DON'T

- **Don't disable the linter or `suppressHydrationWarning` to silence an error.** `layout.tsx:40` already uses it for font-variable injection; do not extend that pattern. Fix the underlying mismatch instead (deterministic seeds, gate on `mounted`, move to `useEffect`).
- **Don't add `maximumScale=1` or `userScalable=false`** to new viewports. The current `layout.tsx:18-23` already violates WCAG 2.5.5 — flag if you touch it, don't propagate.
- **Don't render user/LLM text with `dangerouslySetInnerHTML`.** Current chat renders plain strings in a `<div>` — keep it that way. If markdown is ever needed, sanitize with `DOMPurify`.
- **Don't bind in `removeEventListener`.** `Hyperspeed.tsx:1018` has the classic `.bind(this)` leak — new code must store the bound function in a field and unsubscribe the *same* reference.
- **Don't store secrets in `knowledge.yaml`**, the system prompt, or any client-readable file. The LLM will repeat them.
- **Don't add `cursor: none` to new global selectors.** It already breaks keyboard focus visibility; scope it to `@media (hover: hover) and (pointer: fine)`.
- **Don't ship `console.log` or `print()`** in committed code. Use proper error responses on the backend (without leaking `str(e)`).
- **Don't widen CORS to `allow_origins=["*"]`** — `main.py:43-51` uses an explicit allowlist + Vercel regex; keep it that way.
- **Don't `git add .` blindly.** Stage by name. `.env` is gitignored but `.env.example` is not — confirm before committing env files.
- **Don't introduce new state libraries.** Context + local `useState` is sufficient for this scope.
- **Don't fetch without a cancellation path** when adding new endpoints. `ChatLanding.sendMessage` is missing `AbortController` — fix when you touch it.

## 8. Known issues to fix opportunistically

When you're already editing the file, fix these. Don't open standalone PRs for them unless asked.

| File | Issue |
|---|---|
| `src/app/layout.tsx:21-22` | `maximumScale=1, userScalable=false` blocks pinch zoom (WCAG fail). |
| `src/app/globals.css` | Responsive blocks are duplicated (~lines 145–693). De-dupe when touching this file. |
| `src/components/ui/FluidCursor.tsx:97-110` | Event listeners attached to `document`/`window`; check the effect deps and the cleanup uses the same references. |
| `src/components/ui/Hyperspeed.tsx:~1018` | `removeEventListener('resize', this.onWindowResize.bind(this))` — never removes the listener. |
| `src/components/sections/ChatLanding.tsx:59` | `fetch` has no `AbortController`, no timeout, no retry. Generic catch swallows the real error. |
| `src/app/page.tsx:67-85` | No error boundary around lazy WebGL. If `Hyperspeed` throws, the page errors out. |
| `backend/main.py:123-125` | `ChatRequest.message` is unbounded — add `Field(..., min_length=1, max_length=2000)`. |
| `backend/main.py:182-183` | `HTTPException(500, detail=f"Chat error: {str(e)}")` leaks internals. Log server-side, return a generic message. |
| `backend/main.py` | No rate limit. Add `slowapi` or fronting reverse-proxy throttle. |

## 9. Performance budget

- LCP target: < 2.5 s on Vercel prod.
- Hydration of heavy WebGL is intentionally delayed by 100 ms (`page.tsx:31`). Don't move WebGL into the initial render path.
- Framer Motion is already on the critical path — prefer CSS animations for anything that doesn't need scroll progress / spring physics.
- Use `next/font` (Inter, Syncopate already configured) — no `<link>` to Google Fonts.

## 10. Accessibility floor

- Every interactive element gets a visible focus state.
- Every icon-only button gets `aria-label`.
- Color contrast ≥ 4.5:1 for body text. The gold `#c4a35a` on `#0a0a0a` is borderline — verify before reusing on small text.
- Keyboard must reach every section. Don't rely on hover-only affordances.

## 11. When in doubt

Ask before:
- Renaming routes (`/`, `#ask`, `#about`, etc. are bookmarked anchors).
- Editing `knowledge.yaml` (it's the source of truth for the AI's persona).
- Changing CORS origins, rate limits, or the LLM model.
- Touching `Hyperspeed.tsx` shaders — the file is large and shader changes are easy to break.
