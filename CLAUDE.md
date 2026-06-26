# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## Project

**Project Web by Ghale** — a single-page, awwwards-style portfolio site for a boutique
web design & development studio. Bold, animation-heavy, brand purple `#9772cc` on white.

This was originally a plain static site (`index.html` + `css` + `js`) and has been
**converted to Next.js (App Router)**. The full design intent is documented in
[project-spec.md](project-spec.md) — read it before making design/layout changes.

## Tech stack

- **Next.js 14** (App Router) + **React 18** — JavaScript (`.jsx`), not TypeScript.
- **GSAP 3.12 + ScrollTrigger** — all scroll animation.
- **Lenis** — smooth scrolling (exposed as `window.lenis`).
- Plain global CSS (no Tailwind/CSS-modules). Fonts via Google Fonts `<link>`.
- No backend. The site is fully static/client-rendered; `next build` prerenders one page.

## Commands

```bash
npm install      # install deps (see Google Drive warning below)
npm run dev      # dev server at http://localhost:3000
npm run build    # production build (must pass before pushing)
npm start        # serve the production build
```

## ⚠️ Google Drive constraint (important)

The source lives under `H:\My Drive\...` (Google Drive). **`npm install` fails there** —
Drive's virtual filesystem locks native binaries (`EPERM`/`EBADF` on `next-swc...node`),
and `node_modules` (30k+ files) should never be synced anyway.

**Develop from a local-disk copy of the repo** (e.g. `C:\dev\projectwebsite`), or clone it
from GitHub to a local path. `node_modules` is gitignored, so the repo itself is safe to
keep in Drive. If a build/install must be verified from the Drive path, copy the source
(excluding `node_modules`) to a local folder, install, and build there.

## Structure

```
app/
  layout.jsx     <html>/<body>, metadata, font <link>s, imports globals.css
  page.jsx       "use client" — ALL page markup as JSX; runs initSite() in useEffect
  globals.css    full design system (verbatim from the original style.css)
lib/
  animations.js  initSite() — GSAP/Lenis/cursor/nav/marquee logic (ported from main.js)
public/
  Images/*.webp  project screenshots (portrait, ~1068×1291)
  Project Web Logo.png
project-spec.md  design/brand/section spec — the source of truth for intent
next.config.mjs  reactStrictMode:false (see below)
```

## Architecture notes / conventions

- **Imperative animation, not React state.** `lib/animations.js` selects DOM nodes by
  `id`/class and drives them with GSAP — exactly like the original static site. `page.jsx`
  renders the markup and calls `initSite()` once from a `useEffect`. Keep the element
  `id`s and class names in sync between `page.jsx` and `animations.js`; the JS depends on
  them (e.g. `#workRight`, `.wk`, `#wkCat`, `#preloader`, `.services__dot`,
  `#processScroll`, `#processCards`, `.pcard`, `#techMarquee`).
- **Content lives in arrays at the top of `page.jsx`.** `PROJECTS` (Work deck — first
  card's info is also hard-coded in the `.work__display` left panel, and the `/ N` count
  in `#wkCur`'s sibling is hard-coded; update both when changing the count), `STEPS`
  (Process timeline cards), and `TECH` (stack marquee, rendered twice for the seamless
  loop). The Work left-panel count and active sync are otherwise derived from the DOM.
- **Strict Mode is off** (`next.config.mjs`). Strict Mode double-invokes effects in dev,
  which would register ScrollTriggers twice. Do not re-enable without adding teardown.
- **Plain `<img>`, not `next/image`.** The sticky stacking deck and GSAP transforms rely
  on the native layout; `next/image` wrappers would break it. The `no-img-element` lint
  warning is expected and acceptable.
- **Effects are gated** for touch / reduced-motion via checks in `initSite()`. Preserve
  these guards; there's also a 4.5s preloader safety fallback.
- **CSS is hand-authored and matches the spec exactly.** When changing visuals, prefer
  editing `globals.css` and keep `project-spec.md` accurate.

## Key scroll-driven sections

Each of these spans the markup (`page.jsx`), the styles (`globals.css`), and a GSAP
driver (`animations.js`). Changing one usually means touching all three.

- **Work — stacking deck** (`#workRight` / `.wk`, `initWorkSticky`). On desktop the right
  column is a `position:sticky` deck synced to a left info panel; below `1200px` it becomes
  a single-column **piling deck** (cards keep `position:sticky` and pile/overlap as you
  scroll — *not* a flat list). The CSS breakpoint (`@media(max-width:1200px)`) and the JS
  gate (`window.innerWidth > 1200` for the left-panel sync) must agree. The pile visuals
  run on every screen size; reduced-motion shows a static captioned list.
- **Process — horizontal card timeline** (`#processScroll` / `#processCards` / `.pcard`,
  `initProcessTimeline`). A tall (`340vh`) track pins an inner panel; each card after the
  first slides in from the right and lands in a staggered pile, driven by overall scroll
  progress (card `i` animates across segment `[i/n, (i+1)/n]`). Dark `--ink` base with a
  purple radial glow on the pinned panel. Reduced-motion / no-GSAP falls back to a plain
  stacked list via the `.process--static` class added in JS.
- **Marquees** (`initMarquee`). `#marquee1`, `#marquee2`, `#techMarquee`, `#footerMarquee`
  each auto-scroll via a `xPercent 0↔-50%` loop; content is **duplicated in the markup** so
  the loop is seamless. ScrollTrigger flips `timeScale` with scroll direction.

## Deploying

- It's a Node app: `npm run build` then `npm start`. Works on Vercel (zero config), or any
  Node host (Hostinger Node.js app, Render, Railway) with build `npm run build`, start
  `npm start`.
- It can also be exported fully static (`output: 'export'` in `next.config.mjs` →
  `npm run build` produces `out/`) and dropped on any static host, since there's no server
  code.

## Open items (from project-spec.md §5)

- Project "View project" links are `#` placeholders — wire to real case-study URLs.
- LinkedIn & Facebook URLs are `#` placeholders.
- Stats `50+ / 7 / 100%` are estimates — confirm real figures.
