# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository.

## Project

**Project Web by Ghale** — a single-page, awwwards-style portfolio site for a boutique
web design & development studio. Bold, animation-heavy, brand purple `#9772cc` on white.

This was originally a plain static site (`index.html` + `css` + `js`) and has been
**converted to Next.js (App Router)**.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19** — JavaScript (`.jsx`), not TypeScript.
- **GSAP 3.12 + ScrollTrigger** — all scroll animation.
- **Lenis** — smooth scrolling (exposed as `window.lenis`).
- **OGL** — lightweight WebGL for the hero's procedural shader background.
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
  layout.jsx     <html>/<body>, metadata + JSON-LD, font <link>s, imports globals.css
  page.jsx       "use client" — ALL page markup as JSX; runs initSite() in useEffect
  globals.css    full design system (verbatim from the original style.css)
  sitemap.js     generates /sitemap.xml
  robots.js      generates /robots.txt (points at the sitemap)
  manifest.js    generates /manifest.webmanifest
components/
  ShaderBackground.jsx  reusable OGL/GLSL hero background ("use client")
lib/
  animations.js  initSite() — GSAP/Lenis/cursor/nav/marquee logic (ported from main.js)
public/
  Images/*.webp  project + service screenshots (portrait, ~1068×1291)
  Project Web Logo.png
next.config.mjs  reactStrictMode:false (see below)
```

## Architecture notes / conventions

- **Imperative animation, not React state.** `lib/animations.js` selects DOM nodes by
  `id`/class and drives them with GSAP — exactly like the original static site. `page.jsx`
  renders the markup and calls `initSite()` once from a `useEffect`. Keep the element
  `id`s and class names in sync between `page.jsx` and `animations.js`; the JS depends on
  them (e.g. `#workRight`, `.wk`, `#wkCat`, `#preloader`, `.services__dot`,
  `#processScroll`, `#processCards`, `.pcard`, `#techMarquee`, `#servicesMedia`,
  `#svcPopup`, `#workSkip`, `[data-service]` + its `data-img`).
- **One React component exception:** `components/ShaderBackground.jsx` is the only
  piece NOT driven by `animations.js` — it owns its own WebGL (OGL) lifecycle in a
  `useEffect` (renderer, RAF loop, resize, cursor uniform, teardown). It's rendered
  inside `.hero__bg` and fails silently to the CSS blob fallback if WebGL is missing.
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
- **CSS is hand-authored.** When changing visuals, prefer editing `globals.css`.

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
- **Services — hover-reveal + popup** (`.service[data-service][data-img]`). The purple
  section reveals the hovered service's image as a full-section background via a
  centre-out `clip-path` circle mask (`initServicesMedia` builds one preloaded
  `.services__media-layer` per service; pointer devices only). A scrim
  (`.services__media::after`, `z-index:5`) sits ABOVE the image layers — keep layer
  `z-index` bounded (0/1/2) or the scrim won't darken them. The hovered row is spotlit
  (`!important` opacity, see gotcha). Clicking a service opens the `#svcPopup` lightbox at
  the image's natural aspect ratio (`initServicesPopup`, also the touch fallback). Images
  map by `data-img` → `/Images/<data-img>.webp`.
- **Hero — WebGL shader + cursor glow** (`components/ShaderBackground.jsx`). Procedural
  satin/iridescence in brand purple (no textures); a `uMouse` uniform makes a soft purple
  glow follow the cursor (smoothed). Lives behind `.grid-lines`, above the fallback
  `.blob`s. DPR-capped, pauses offscreen/hidden, static frame under reduced-motion.
- **Process cards — cursor spotlight** (`.pcard::after`, `initProcessCards`). A purple
  radial gradient follows the mouse inside each card via `--mx`/`--my` CSS vars (pointer
  only). Card content is kept above it with `z-index:1`.
- **Work — floating skip button** (`#workSkip`, `initWorkSkip`). A fixed bottom-centre
  pill that appears once past the 5th project AND while the Work section is in view (two
  ScrollTriggers). Direction-aware: scrolling down → "Skip ahead" → `#process`; scrolling
  up → "Skip back up" → `#services`. Its click does a long eased `lenis.scrollTo`. Must be
  rendered at page root (NOT inside the transformed Work section) so `position:fixed` works.

## SEO & Search Console

- All metadata lives in `app/layout.jsx` (`metadata` export) plus inline **JSON-LD**
  (`ProfessionalService`). `metadataBase` / `SITE_URL` is `https://projectweb.net` — the
  real production domain; sitemap, robots, canonical and OG all derive from it.
- **Google Search Console** uses the HTML-tag method: paste the verification code into the
  `GOOGLE_SITE_VERIFICATION` constant in `app/layout.jsx` (feeds `metadata.verification.google`),
  deploy, then Verify and submit `sitemap.xml`.
- OG/Twitter image is currently the logo PNG — a dedicated 1200×630 image would be better.

## Gotchas (learned the hard way)

- **Never run `npm run build` while `npm run dev` is running.** The production build
  overwrites the shared `.next/` dir, so the dev server then 404s every JS/CSS chunk and
  the page goes blank. To recover: stop dev, `rm -rf .next`, restart dev. To verify a
  build safely, do it when dev is stopped (or in a separate copy).
- **GSAP `gsap.from()` leaves an inline `opacity` on the element** after its reveal
  (e.g. `initListItems` on `[data-service]`). Inline styles beat stylesheet rules, so any
  CSS that later sets `opacity` on those elements (e.g. the services hover-dim) needs
  `!important` to take effect.
- **Drive Lenis from ONE rAF source.** With GSAP present, advance it from
  `gsap.ticker` and sync `ScrollTrigger.update` on its `scroll` event — do NOT also run a
  separate `requestAnimationFrame` loop calling `lenis.raf` (double-stepping = jitter).
- **`position:fixed` breaks inside transformed ancestors.** Any fixed overlay (e.g.
  `#workSkip`) must be rendered at the page root, not within a section that GSAP transforms.

## Deploying

- It's a Node app: `npm run build` then `npm start`. Works on Vercel (zero config), or any
  Node host (Hostinger Node.js app, Render, Railway) with build `npm run build`, start
  `npm start`.
- It can also be exported fully static (`output: 'export'` in `next.config.mjs` →
  `npm run build` produces `out/`) and dropped on any static host, since there's no server
  code.

## Open items

- Project "View project" links are `#` placeholders — wire to real case-study URLs.
- LinkedIn & Facebook URLs are `#` placeholders.
- Stats `50+ / 7 / 100%` are estimates — confirm real figures.
