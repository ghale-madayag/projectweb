# Project Web by Ghale

A bold, awwwards-style single-page portfolio for a boutique web design & development
studio — built with **Next.js**, **GSAP/ScrollTrigger**, and **Lenis** smooth scroll.

> "I don't just develop; I design with an artist's eye and a coder's precision."

Brand purple `#9772cc` on white.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) + React 18 — JavaScript
- [GSAP 3.12 + ScrollTrigger](https://gsap.com/) — scroll animation
- [Lenis](https://lenis.darkroom.engineering/) — smooth scrolling
- Plain global CSS, Google Fonts (Archivo / Inter / Space Grotesk)

## Getting started

> **Important:** Don't run this from a Google Drive / OneDrive synced folder.
> `npm install` fails on those filesystems (file-locking on native binaries), and
> `node_modules` shouldn't be synced. Clone to a **local disk** path.

```bash
git clone <your-repo-url>
cd projectwebsite
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (localhost:3000) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run Next.js ESLint |

## Project structure

```
app/
  layout.jsx     root layout, metadata, fonts
  page.jsx       all page markup (client component)
  globals.css    full design system
lib/
  animations.js  GSAP / Lenis / cursor / nav interactions
public/
  Images/        project screenshots
  Project Web Logo.png
```

## Deployment

This is a standard Next.js Node app.

- **Vercel** — import the repo, zero config.
- **Any Node host** (Hostinger Node.js app, Render, Railway): build `npm run build`,
  start `npm start`, Node ≥ 18.
- **Static export** — add `output: 'export'` to `next.config.mjs`, run `npm run build`,
  and deploy the generated `out/` folder to any static host (there is no server code).

## License

© Project Web by Ghale. All rights reserved.
