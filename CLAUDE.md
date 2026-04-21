# CLAUDE.md

## Project Overview
Personal portfolio website for Andy Zhu — Cambridge CS student graduating July 2026.
Deployed to GitHub Pages at andyzhu23.github.io.

## Tech Stack
- React 18 + TypeScript
- Vite 6 (dev server & build)
- React Router v7 (multi-page routing)
- Plain CSS (no frameworks)
- gh-pages for deployment

## Commands
- `npm run dev` — start dev server (usually localhost:5173)
- `npm run build` — TypeScript compile + Vite production build
- `npm run lint` — ESLint
- `npm run preview` — preview production build
- `npm run deploy` — build and deploy to GitHub Pages

## Project Structure
```
src/
  components/
    Background.tsx — interactive elliptic curve (y²=x³-x+1) canvas background
    DustText.tsx   — Ultraman Nexus-style intro animation (explosion, lasers, DNA helix, title reveal)
    Navbar.tsx     — fixed top navigation with mobile hamburger menu
    Footer.tsx     — simple copyright footer
  pages/
    Home.tsx       — landing page with intro animation + social links
    About.tsx      — bio, photo, education, skills, connect links
    Experience.tsx — professional experience timeline (Jump Trading, Meta, Man Group)
    Blog.tsx       — placeholder with photo
    Interests.tsx  — competitive programming profiles + bridge
    Projects.tsx   — disabled but kept on disk for future use
  App.tsx          — root component with routing
  main.tsx         — entry point, clears intro-done on fresh load
  index.css        — all global styles
public/
  profile.jpg      — headshot photo (About page)
  blog-photo.jpg   — beach photo (Blog page)
  CV_Andy_Zhu.pdf  — downloadable CV (About page → Curriculum Vitae card)
```

## Session Recording
Every Claude Code session automatically appends its transcript to this CLAUDE.md
when it ends. Wired via `.claude/settings.json` → SessionEnd hook →
`.claude/record-session.sh`. Sessions appear below this line, each prefixed with
a `## Session <timestamp>` header. Trim or archive old sessions periodically to
keep the file from growing unbounded (it is loaded into context every session).

## Intro Animation Sequence (DustText.tsx)
The home page plays an Ultraman Nexus-inspired intro on first visit:
1. Slow full-screen explosion with particles (0-5s)
2. Laser beams streak across screen (3-6.5s)
3. Two DNA helixes (cyan + pink) spiral inward with glowing heads (3.5-6.5s)
4. Elliptic curve background fades in when DNA ends (6s)
5. Title appears distorted/glitchy (6s)
6. Per-character lasers fire in random order, each clearing a character on impact with sparks (7-9s)
7. 1s pause, then canvas fades out and DOM title/content fades in

The animation skips on SPA navigation back to Home (module-level flag), but replays on full page refresh.

## Elliptic Curve Background (Background.tsx)
- Curve: y² = x³ - x + 1 with interactive point addition
- Mouse hover shows nearest curve point Q with addition chord P→Q
- Click performs elliptic curve point addition (P = P+Q) with animated transition
- Static layer (grid, axes, curve) pre-rendered to offscreen canvas for performance
- findNearest only recomputes when mouse moves (dirty flag)

## Performance Notes
- No shadowBlur anywhere — glow effects use concentric circles instead
- Dead particles/sparks spliced from arrays immediately
- Metallic title gradient cached and reused
- Background static elements rendered to offscreen canvas, blitted each frame

## Conventions
- Dark theme (background: #0a0a0f, accents: cyan/blue/green/purple)
- Functional components with hooks
- CSS class naming: kebab-case
- No CSS modules or preprocessors — plain CSS with CSS custom properties
- Intro visibility controlled via `body.intro-done` class + CSS transitions
- Font stack: Inter (body), Playfair Display (title), JetBrains Mono (code/labels)
