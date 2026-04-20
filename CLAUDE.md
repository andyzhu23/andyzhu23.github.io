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
  components/    — reusable components (Navbar, Footer, Background)
  pages/         — page components (Home, About, Experience, Projects, Awards, Blog, Interests)
  App.tsx        — root component with routing
  main.tsx       — entry point
  index.css      — global styles
public/          — static assets
```

## Conventions
- Dark theme (background: #0a0a0f, accents: cyan/blue tones)
- Functional components with hooks
- CSS class naming: kebab-case
- No CSS modules or preprocessors — plain CSS with CSS custom properties
- Interactive canvas background renders on all pages
