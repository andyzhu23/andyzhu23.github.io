# CLAUDE.md

## Project Overview
Personal portfolio website for Andy Zhu — Cambridge CS student graduating July 2026.
Deployed to GitHub Pages at andyzhu23.github.io.

## Tech Stack
- React 18 + TypeScript
- Vite 6 (dev server & build)
- React Router v7 (multi-page routing)
- Plain CSS (no frameworks)
- KaTeX for blog math rendering (imported once in main.tsx)
- gh-pages for deployment

## Commands
- `npm run dev` — start dev server (usually localhost:5173)
- `npm run build` — check-photos + TypeScript compile + Vite production build
- `npm run lint` — ESLint
- `npm run preview` — preview production build
- `npm run deploy` — build and deploy to GitHub Pages
- `npm run optimize-photos` — regenerate web JPGs from `photos-raw/`
- `npm run check-photos` — validate photo refs in `src/data/photoPosts/` against `public/images/posts/`. Fails on missing refs; warns on orphans, oversized (>600 KB), and duplicates. Runs automatically as part of `build`.

## Project Structure
```
src/
  components/
    Background.tsx       — interactive elliptic curve (y²=x³-x+1) canvas background
    ParticleNetwork.tsx  — ambient dust particles floating over the page
    DustText.tsx         — Ultraman Nexus-style intro animation (explosion, lasers, DNA helix, title reveal)
    Navbar.tsx           — fixed top navigation with mobile hamburger menu
    Footer.tsx           — simple copyright footer
    PhotoPost.tsx        — single photo-feed entry, lazy-loads via IntersectionObserver
    PhotoCarousel.tsx    — swipeable multi-photo carousel used inside PhotoPost
    Math.tsx             — <InlineMath/> and <BlockMath/> wrappers around KaTeX (for blog posts)
  pages/
    Home.tsx       — landing page with intro animation + social links
    About.tsx      — bio, photo, education, skills, connect links
    Experience.tsx — professional experience timeline (Jump Trading, Meta, Man Group)
    Photos.tsx     — photo feed ("Instagram-style") rendered from photoPosts data
    Interests.tsx  — competitive programming profiles + bridge
    Projects.tsx   — projects showcase
    Blog.tsx       — blog index listing entries in src/data/blogPosts
    BlogPost.tsx   — individual post page, routed by slug via /blog/:slug
  data/
    photoPosts/    — per-year photo feed entries (2023.ts, 2024.ts, ...), barrel exports concatenated+sorted array
    blogPosts/     — one TSX file per post exporting { meta, default Component }, aggregated+sorted in index.ts
  App.tsx          — root component with routing
  main.tsx         — entry point, clears intro-done on fresh load
  index.css        — all global styles
public/
  404.html              — GitHub Pages SPA fallback
  favicon.svg           — site favicon
  CV_Andy_Zhu.pdf       — downloadable CV (About page → Curriculum Vitae card)
  images/
    profile.jpg         — headshot photo (About page)
    avatar.png          — avatar used in photo feed posts
    blog-photo.jpg      — legacy photo asset
    photos-hero.jpg     — hero image at top of Photos page
    朱哲远.png            — Chinese-name graphic asset
    posts/              — single web JPG per photo (max 1600px, quality 82). No thumbnails, no variants — single-file policy keeps git history lean.
scripts/
  optimize-photos.mjs — photos-raw/ → public/images/posts/ pipeline
  check-photos.mjs    — build-time photo ref validator
```

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