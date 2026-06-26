# Project Web by Ghale — Website Specification

A revamp of [projectweb.net](https://projectweb.net) into a bold, modern, awwwards-style
single-page portfolio site for a boutique web design & development studio.

---

## 1. Brand & Direction

| Item | Value |
|------|-------|
| **Studio** | Project Web by Ghale |
| **Positioning** | Boutique web design & development studio, custom-built sites & web apps |
| **Tagline** | "I don't just develop; I design with an artist's eye and a coder's precision." |
| **Aesthetic** | Bold, modern, awwwards-grade. Reference: [Webix / Animation-Addons](https://templates.animation-addons.com/webix/) |
| **Primary color** | `#9772cc` (purple) |
| **Background** | White `#ffffff` |
| **Logo** | `Project Web Logo.png` — "PROJECT" (dark) + "WEB" (purple) + "by Ghale" |

### Color tokens
```
--purple:#9772cc   --purple-deep:#7a52b6   --purple-dark:#5e3b94
--tint:#f4eefc     --ink:#15131a           --ink-soft:#4a4655
--muted:#8b8794    --line:#e7e3ee          --bg/white:#ffffff
```

### Typography
- **Display / headings:** Archivo (weights 800–900), uppercase for big statements
- **Body:** Inter
- **Accent:** Space Grotesk
- Loaded via Google Fonts.

---

## 2. Tech Stack

- **Static site** — plain `index.html`, `css/style.css`, `js/main.js` (no build step).
- **GSAP 3.12** + **ScrollTrigger** — all scroll animation.
- **Lenis 1.1** — smooth scrolling (exposed as `window.lenis`).
- Assets: `Images/*.webp` (14 portrait project screenshots ~1068×1291), logo PNG.
- Local preview served on port `4321` (`.claude/launch.json`).

### File map
```
index.html          markup + section structure
css/style.css       full design system, responsive, reduced-motion
js/main.js          all interactions (IIFE, guarded by hasGSAP / prefersReduced / isTouch)
Images/             14 project screenshots
Project Web Logo.png
project-spec.md     this document
```

### Global behaviors
- **Preloader** — animated "PROJECT WEB" logo reveal + 0→100% counter, curtain wipe. **Safety fallback**: site force-initializes after 4.5s if rAF/GSAP stalls.
- **Custom cursor** — dot + follower; grows on `[data-cursor="hover"]`, becomes a filled "VIEW" circle on `[data-cursor="view"]`. Disabled on touch.
- **Magnetic buttons** — `.magnetic` elements pull toward the cursor.
- **Nav** — fixed; hides on scroll-down / shows on scroll-up; blurred bg when scrolled; scroll-progress bar.
- **Mobile menu** — fullscreen dark overlay; logo + close (✕) invert to white while open.
- Respects `prefers-reduced-motion` and falls back gracefully without JS/GSAP.

---

## 3. Page Structure (top → bottom)

### 3.1 Hero
- Massive uppercase two-line headline: **"ARTIST'S EYE. / CODER'S PRECISION."** ("Artist's" italic, "Coder's precision." in purple).
- Eyebrows (studio label / worldwide), lead paragraph, "Selected Work" scroll cue.
- Parallax gradient blobs + faint grid background.
- Masked line-by-line reveal on load.

### 3.2 Marquee (services)
- Scrolling: Web Design ✦ Development ✦ UI/UX ✦ E-Commerce ✦ Branding.
- Direction reacts to scroll velocity.

### 3.3 About / Intro statement
- Big **uppercase bold statement** with **inline image "chips" combined into the text** (reference: Canopy "next gen solutions" style):
  > A boutique studio where pixel-perfect **DESIGN** 🖼 meets engineering **PRECISION** ⭕ … hand-built — bold, fast 🖼 & unmistakably **YOURS** ●
- 3 inline thumbnails (rounded + one circular), sized in `em` so they scale with the text.
- Word-by-word scrub reveal (words + chips fade from dim → full).
- The final **purple dot (●)** after "YOURS" is oversized — it visually seeds the Services reveal.
- Followed by **animated stat counters**: `50+` projects · `7` countries · `100%` custom-built.

### 3.4 Services — "Services built to stand out." + circle reveal
- Heading: "SERVICES BUILT TO **STAND OUT**" — the period is a **purple dot** (`.services__dot`, replaces the text period).
- **Scroll transition:** section is briefly **pinned**; a purple circle **grows out of the dot** (anchored to the dot's exact position, `left ≈ 90% / top ≈ 34vh`) until it fills the screen and the whole section background becomes **`#9772cc`**.
  - Circle uses a **large base scaled DOWN** (`260vmax`, `scale 0 → 1`) so the edge stays crisp (no upscale blur), and pinning makes it a **true full circle** (no clipped dome).
  - At ~42% progress the section toggles `is-purple`: bg → purple, text → white, "STAND OUT" accent → dark ink, dot → dark ink.
- 4 service rows with slide-up dark hover fill + tech tags:
  1. Web Design & UI/UX — Figma, Design Systems, Prototyping
  2. Web Development — Laravel, Vue.js, Inertia
  3. E-Commerce & Web Apps — Storefronts, Dashboards, Integrations
  4. CMS & WordPress — WordPress, Elementor, Maintenance

### 3.5 Work — "Recent projects." (sticky split + stacking)
- **Two-column layout:**
  - **Left (sticky):** "(02) Selected Work" + large "RECENT PROJECTS." heading + the **active project's** category, name, description, "View project" link, and `NN / 14` counter. Updates with a fade/slide swap as each image reaches center (direction-aware via `onEnter` / `onLeaveBack`).
  - **Right (scrolling):** the 14 project images as a **sticky stacking deck** — each portrait card sticks centered and the next stacks over it; the covered card recedes (scale ~0.9, slight lift) with a soft shadow for depth.
- **Images are portrait** (native `1068:1291`), centered cards.
- **Zoom-out parallax:** each image starts enlarged (~1.25) and **scales back to normal (1.0) exactly when it reaches center** / its sticky position.
- **Mobile:** falls back to a single-column list with a caption (name + category) under each image (no sticky pile).

**Project list (image → title → category):**
| # | Image | Title | Category |
|---|-------|-------|----------|
| 01 | Allfliptix | Allfliptix | Event Ticketing Platform |
| 02 | Kingland-Global | Kingland Global | Corporate Website |
| 03 | Permanent-House-of-Beauty | House of Beauty | Beauty & Salon |
| 04 | Kasining-Gallery-Online | Kasining Gallery | Online Art Gallery |
| 05 | Music-Beat | Music Beat | Music Platform |
| 06 | Bahaghari-Cargo | Bahaghari Cargo | Logistics & Cargo |
| 07 | Crypto-Buddies | Crypto Buddies | Web3 / Crypto |
| 08 | Dr-Reshma | Dr. Reshma | Medical Practice |
| 09 | Learning-Management-System-2 | TAU LMS | Education Platform |
| 10 | Gecko-Sport | Gecko Sport | Sports & Retail |
| 11 | Virtual-Assistant-Solution | VA Solutions | Virtual Assistant |
| 12 | WA-Oral-and-Maxillofacial-Surgery | WA Oral Surgery | Healthcare |
| 13 | Media-Success | Media Success | Media Agency |
| 14 | Premier-Global | Premier Global | Corporate Website |

### 3.6 Locations marquee
- Dark strip, reverse direction: USA — Canada — Dubai — Australia — Singapore — New Zealand — Philippines.

### 3.7 Process
- Numbered steps: 01 Discover · 02 Design · 03 Develop · 04 Deploy.

### 3.8 Tech stack strip
- Light-purple band, centered: Laravel · Vue.js · Inertia.js · WordPress · Elementor · **Breakdance** · Figma · **Claude Code** · **Zapier Automation**.

### 3.9 CTA
- Dark section, purple glow, huge "GOT A PROJECT IN **MIND?**" + email pill (`info@projectweb.net`) + channels (WhatsApp, Viber, Instagram, LinkedIn).

### 3.10 Footer (sticky reveal + giant wordmark)
- **Sticky-reveal:** footer sits behind the content and is exposed as the CTA scrolls up. Falls back to a normal in-flow footer if it's taller than the viewport (e.g., small screens).
- **City marquee** with purple superscript country codes: Manila ᴾᴴ · NYC ᵁˢ · Toronto ᶜᴬ · Dubai ᴬᴱ · Sydney ᴬᵁ · Singapore ˢᴳ · Auckland ᴺᶻ.
- **Contact row** (3 cols): *Project Web by Ghale / Philippines — Worldwide* · *Tel +63 929 837 0289* · *info@projectweb.net*.
- **Meta line:** ↳ Instagram · ↳ LinkedIn · ↳ Facebook + `© <year>, Project Web by Ghale` + Back to top.
- **Giant wordmark:** **"PROJECT WEB"** filling the width edge-to-edge (slight clip), "WEB" in purple. Sized `~13.6vw`.

---

## 4. Contact / Business Info

- **Email:** info@projectweb.net
- **Phone / WhatsApp / Viber:** +63 929 837 0289
- **Instagram:** @projectwebbyghale
- **Reach:** USA, Canada, Dubai, Australia, Singapore, New Zealand, Philippines
- **Stack expertise:** Laravel, Vue.js, Inertia.js, WordPress, Elementor, Breakdance, Figma, Claude Code, Zapier Automation

---

## 5. Open Items / TODO

- [ ] **Project links** — work "View project" + image links currently point to `#`; wire to live URLs / case studies.
- [ ] **LinkedIn & Facebook URLs** — currently `#` placeholders.
- [ ] **Stats** — `50+ / 7 / 100%` are estimates; confirm real figures.
- [ ] Decide whether to keep both the mid-page **countries marquee** and the footer **cities marquee** (currently both present).
- [ ] Optional: deploy (Netlify / Vercel / GitHub Pages).

---

## 6. Conventions / Notes

- All scroll animations are **scrubbed** (tied to scroll position) and reversible.
- Effects are gated: skipped or simplified for **touch**, **no-GSAP**, and **reduced-motion** users.
- The Services pin adds ~85vh of scroll "hold" while the circle grows (tunable).
- Brand purple is exact: `rgb(151,114,204)` = `#9772cc`.
