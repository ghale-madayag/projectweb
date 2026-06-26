"use client";

import { useEffect, Fragment } from "react";
import ShaderBackground from "../components/ShaderBackground";

/* Reusable arrow icon used by several buttons */
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Tech stack — drives the animated marquee in the "Built with a modern stack" strip */
const TECH = [
  "Laravel",
  "Vue.js",
  "Inertia.js",
  "WordPress",
  "Elementor",
  "Breakdance",
  "Figma",
  "Claude Code",
  "Zapier Automation",
];

/* Process phases — drives the horizontal scroll-stacked card timeline.
   Content is unchanged from the original four-step process. */
const STEPS = [
  {
    title: "Discover",
    text: "We dig deep into your goals, your audience, and your brand — asking the right questions long before any pixels or code. No guesswork and no assumptions, just a clear, shared direction and a plan everyone feels confident in from day one.",
  },
  {
    title: "Design",
    text: "We craft high-fidelity designs in Figma so you can see exactly how every screen looks and feels before a single line of code is written. We refine the layout, type, colour and motion together until it's polished, on-brand and unmistakably yours.",
  },
  {
    title: "Develop",
    text: "Your designs become a fast, hand-coded, fully responsive site built with the right stack for the job — never a bloated template. Clean, scalable code with smooth animation and performance that holds up on every device, browser and connection.",
  },
  {
    title: "Deploy",
    text: "We launch, test across browsers and devices, and fine-tune every detail until it's flawless. Then we stick around with ongoing support, monitoring and improvements so your site keeps performing and growing long after go-live.",
  },
];

/* Project list — drives the sticky stacking deck on the right of "Work" */
const PROJECTS = [
  {
    img: "City-Mind-NP-Psychiatry",
    alt: "City Mind NP Psychiatry",
    name: "City Mind NP",
    cat: "Psychiatry & Behavioral Health",
    desc: "A calming, conversion-focused site for a psychiatric practice — evidence-based care, easy booking and HIPAA-compliant trust signals.",
  },
  {
    img: "LT-Fulfillment",
    alt: "L&T Fulfillment LLC",
    name: "L&T Fulfillment",
    cat: "Freight & Logistics",
    desc: "A bold dark-mode site for an expedited freight company — real-time dispatch, secure TWIC-authorized transport and live fleet performance.",
  },
  {
    img: "Allfliptix",
    alt: "Allfliptix",
    name: "Allfliptix",
    cat: "Event Ticketing Platform",
    desc: "A full event ticketing & inventory platform built on Laravel, Vue and Inertia — fast checkout and real-time seat management.",
  },
  {
    img: "Kingland-Global",
    alt: "Kingland Global",
    name: "Kingland Global",
    cat: "Corporate Website",
    desc: "A polished corporate presence for a global trading firm — built for credibility and clear conversion.",
  },
  {
    img: "Permanent-House-of-Beauty",
    alt: "Permanent House of Beauty",
    name: "House of Beauty",
    cat: "Beauty & Salon",
    desc: "An elegant, booking-ready site for a permanent makeup studio, showcasing services and real results.",
  },
  {
    img: "Kasining-Gallery-Online",
    alt: "Kasining Gallery Online",
    name: "Kasining Gallery",
    cat: "Online Art Gallery",
    desc: "A refined online gallery presenting artists and collections with a museum-grade browsing experience.",
  },
  {
    img: "Music-Beat",
    alt: "Music Beat",
    name: "Music Beat",
    cat: "Music Platform",
    desc: "A vibrant platform for music lessons and classes with playful, energetic branding.",
  },
  {
    img: "Bahaghari-Cargo",
    alt: "Bahaghari Cargo",
    name: "Bahaghari Cargo",
    cat: "Logistics & Cargo",
    desc: "A logistics site with live box tracking and a trust-first layout for cross-border shipping.",
  },
  {
    img: "Crypto-Buddies",
    alt: "Crypto Buddies",
    name: "Crypto Buddies",
    cat: "Web3 / Crypto",
    desc: "A bold dark-mode landing for a Web3 community with animated, high-impact storytelling.",
  },
  {
    img: "Dr-Reshma",
    alt: "Dr. Reshma",
    name: "Dr. Reshma",
    cat: "Medical Practice",
    desc: "A clean, reassuring website for a medical practice focused on clarity and easy appointments.",
  },
  {
    img: "Learning-Management-System-2",
    alt: "Learning Management System",
    name: "TAU LMS",
    cat: "Education Platform",
    desc: "A learning management system for Tarlac Agricultural University, serving students and faculty.",
  },
  {
    img: "Gecko-Sport",
    alt: "Gecko Sport",
    name: "Gecko Sport",
    cat: "Sports & Retail",
    desc: "An energetic storefront for a sports retail brand with a fast, mobile-first shopping flow.",
  },
  {
    img: "Virtual-Assistant-Solution",
    alt: "Virtual Assistant Solution",
    name: "VA Solutions",
    cat: "Virtual Assistant",
    desc: "A conversion-focused site for a virtual assistant agency highlighting services and outcomes.",
  },
  {
    img: "WA-Oral-and-Maxillofacial-Surgery",
    alt: "WA Oral and Maxillofacial Surgery",
    name: "WA Oral Surgery",
    cat: "Healthcare",
    desc: "A professional, calming presence for an oral & maxillofacial surgery practice.",
  },
  {
    img: "Media-Success",
    alt: "Media Success",
    name: "Media Success",
    cat: "Media Agency",
    desc: "A confident agency site built to showcase media services and drive enquiries.",
  },
  {
    img: "Premier-Global",
    alt: "Premier Global",
    name: "Premier Global",
    cat: "Corporate Website",
    desc: "A corporate website for a global services company, structured for trust and scale.",
  },
];

export default function Home() {
  useEffect(() => {
    // Run the imperative GSAP/Lenis logic only in the browser, after mount.
    let disposed = false;
    import("../lib/animations").then((m) => {
      if (!disposed) m.initSite();
    });
    return () => {
      disposed = true;
    };
  }, []);

  return (
    <>
      {/* ===== PRELOADER ===== */}
      <div className="preloader" id="preloader">
        <div className="preloader__inner">
          <div className="preloader__logo">
            <span className="pl-line">PROJECT</span>
            <span className="pl-line pl-accent">WEB</span>
          </div>
          <div className="preloader__count">
            <span id="plCount">0</span>
            <i>%</i>
          </div>
        </div>
        <div className="preloader__bar">
          <span id="plBar"></span>
        </div>
      </div>

      {/* ===== CUSTOM CURSOR ===== */}
      <div className="cursor" id="cursor"></div>
      <div className="cursor-follow" id="cursorFollow">
        <span>view</span>
      </div>

      {/* ===== PROGRESS BAR ===== */}
      <div className="scroll-progress" id="scrollProgress"></div>

      {/* ===== NAV ===== */}
      <header className="nav" id="nav">
        <a
          href="#hero"
          className="nav__logo"
          data-cursor="hover"
          aria-label="Project Web home"
        >
          <img src="/Project Web Logo.png" alt="Project Web by Ghale" />
        </a>
        <nav className="nav__menu">
          <a href="#work" className="nav__link" data-cursor="hover">
            <span>Work</span>
          </a>
          <a href="#services" className="nav__link" data-cursor="hover">
            <span>Services</span>
          </a>
          <a href="#about" className="nav__link" data-cursor="hover">
            <span>About</span>
          </a>
          <a href="#process" className="nav__link" data-cursor="hover">
            <span>Process</span>
          </a>
        </nav>
        <a href="#contact" className="nav__cta magnetic" data-cursor="hover">
          <span>Let&apos;s talk</span>
          <ArrowIcon />
        </a>
        <button className="nav__burger" id="burger" aria-label="Menu">
          <span></span>
          <span></span>
        </button>
      </header>

      {/* ===== MOBILE MENU ===== */}
      <div className="mobile-menu" id="mobileMenu">
        <nav className="mobile-menu__links">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="mobile-menu__foot">
          <a href="mailto:info@projectweb.net">info@projectweb.net</a>
          <span>+63 929 837 0289</span>
        </div>
      </div>

      <main id="smooth-content">
        {/* ===== HERO ===== */}
        <section className="hero" id="hero">
          <div className="hero__bg" aria-hidden="true">
            {/* Static blobs are the fallback if WebGL is unavailable; the
                shader canvas paints opaque white over them when it runs. */}
            <span className="blob blob--1"></span>
            <span className="blob blob--2"></span>
            <ShaderBackground className="hero__shader" />
            <span className="grid-lines"></span>
          </div>

          <div className="hero__top">
            <span className="hero__eyebrow">
              Web Design &amp; Development Studio
            </span>
            <span className="hero__eyebrow hero__eyebrow--right">
              Est. — Worldwide Clients
            </span>
          </div>

          <h1 className="hero__title">
            <span className="line">
              <span className="word italic">Artist&apos;s</span>{" "}
              <span className="word">eye.</span>
            </span>
            <span className="line">
              <span className="word accent">Coder&apos;s</span>{" "}
              <span className="word accent">precision.</span>
            </span>
          </h1>

          <div className="hero__bottom">
            <p className="hero__lead">
              I&apos;m Ghale — I don&apos;t just develop. I craft fast, beautiful,
              custom websites &amp; web apps that move people and move metrics.
            </p>
            <a href="#work" className="hero__scroll" data-cursor="hover">
              <span className="hero__scroll-txt">Selected Work</span>
              <span className="hero__scroll-ring">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M6 13l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>
        </section>

        {/* ===== MARQUEE ===== */}
        <section className="marquee" aria-hidden="true">
          <div className="marquee__track" id="marquee1">
            <span>Web Design</span><i>✦</i><span>Development</span><i>✦</i>
            <span>UI / UX</span><i>✦</i><span>E-Commerce</span><i>✦</i>
            <span>Branding</span><i>✦</i>
            <span>Web Design</span><i>✦</i><span>Development</span><i>✦</i>
            <span>UI / UX</span><i>✦</i><span>E-Commerce</span><i>✦</i>
            <span>Branding</span><i>✦</i>
          </div>
        </section>

        {/* ===== ABOUT / INTRO ===== */}
        <section className="intro" id="about">
          <p className="intro__statement" data-reveal-words>
            <span className="word">A</span> <span className="word">boutique</span>{" "}
            <span className="word">studio</span> <span className="word">where</span>{" "}
            <span className="word">pixel-perfect</span>{" "}
            <span className="word accent">design</span>
            <span className="word ph">
              <img src="/Images/Kasining-Gallery-Online.webp" alt="" loading="lazy" />
            </span>
            <span className="word">meets</span>{" "}
            <span className="word">engineering</span>{" "}
            <span className="word accent">precision.</span>
            <span className="word ph ph--round">
              <img src="/Images/Allfliptix.webp" alt="" loading="lazy" />
            </span>
            <span className="word">Every</span> <span className="word">site</span>{" "}
            <span className="word">is</span> <span className="word">hand-built</span> —{" "}
            <span className="word">bold,</span> <span className="word">fast</span>
            <span className="word ph">
              <img src="/Images/Music-Beat.webp" alt="" loading="lazy" />
            </span>
            <span className="word">&amp;</span>{" "}
            <span className="word">unmistakably</span>{" "}
            <span className="word accent">yours</span>
            <span className="word intro__dot" aria-hidden="true"></span>
          </p>
          <div className="intro__meta">
            <div className="intro__stats">
              <div className="stat">
                <span className="stat__num" data-count="50" data-suffix="+">
                  0
                </span>
                <span className="stat__label">Projects Shipped</span>
              </div>
              <div className="stat">
                <span className="stat__num" data-count="7" data-suffix="">
                  0
                </span>
                <span className="stat__label">Countries Served</span>
              </div>
              <div className="stat">
                <span className="stat__num" data-count="100" data-suffix="%">
                  0
                </span>
                <span className="stat__label">Custom-Built</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SERVICES ===== */}
        <section className="services" id="services">
          <span className="services__circle" aria-hidden="true"></span>
          {/* Hover-reveal background — JS fills one layer per service (see
              initServicesMedia); the hovered service's image zooms in here */}
          <div className="services__media" id="servicesMedia" aria-hidden="true"></div>
          <div className="section-head">
            <span className="section-head__tag" data-reveal>
              (01) — What I Do
            </span>
            <h2 className="section-head__title" data-reveal>
              Services
              <br />
              built to<span className="accent"> stand out</span>
              <span className="services__dot" aria-hidden="true"></span>
            </h2>
          </div>

          <div className="services__list">
            <article
              className="service"
              data-service
              data-img="Web-Design"
              data-cursor="view"
            >
              <span className="service__no">01</span>
              <h3 className="service__title">Web Design &amp; UI/UX</h3>
              <p className="service__desc">
                Brand-led interfaces designed in Figma — from wireframes to
                high-fidelity systems that feel effortless and look unforgettable.
              </p>
              <div className="service__tags">
                <span>Figma</span>
                <span>Design Systems</span>
                <span>Prototyping</span>
              </div>
            </article>
            <article
              className="service"
              data-service
              data-img="Web-Development"
              data-cursor="view"
            >
              <span className="service__no">02</span>
              <h3 className="service__title">Web Development</h3>
              <p className="service__desc">
                Production-grade builds with Laravel, Vue &amp; Inertia. Clean,
                scalable code that&apos;s fast on every device and a joy to maintain.
              </p>
              <div className="service__tags">
                <span>Laravel</span>
                <span>Vue.js</span>
                <span>Inertia</span>
              </div>
            </article>
            <article
              className="service"
              data-service
              data-img="E-Commerce-Web-Apps"
              data-cursor="view"
            >
              <span className="service__no">03</span>
              <h3 className="service__title">E-Commerce &amp; Web Apps</h3>
              <p className="service__desc">
                Inventory systems, booking flows, ticketing platforms — complex
                functionality wrapped in a simple, conversion-focused experience.
              </p>
              <div className="service__tags">
                <span>Storefronts</span>
                <span>Dashboards</span>
                <span>Integrations</span>
              </div>
            </article>
            <article
              className="service"
              data-service
              data-img="CMS-WordPress"
              data-cursor="view"
            >
              <span className="service__no">04</span>
              <h3 className="service__title">CMS &amp; WordPress</h3>
              <p className="service__desc">
                Editor-friendly sites with WordPress &amp; Elementor — so you can
                update content yourself without breaking the design.
              </p>
              <div className="service__tags">
                <span>WordPress</span>
                <span>Elementor</span>
                <span>Maintenance</span>
              </div>
            </article>
          </div>
        </section>

        {/* ===== WORK ===== */}
        <section className="work" id="work">
          <div className="work__layout">
            {/* Sticky left: active project info */}
            <div className="work__left">
              <span className="section-head__tag">(02) — Selected Work</span>
              <h2 className="work__h2">
                Recent<span className="accent"> projects.</span>
              </h2>
              <div className="work__display">
                <span className="work__cat" id="wkCat">
                  Psychiatry &amp; Behavioral Health
                </span>
                <h3 className="work__name" id="wkName">
                  City Mind NP
                </h3>
                <p className="work__desc" id="wkDesc">
                  A calming, conversion-focused site for a psychiatric practice —
                  evidence-based care, easy booking and HIPAA-compliant trust signals.
                </p>
                <div className="work__foot">
                  <a
                    className="work__more magnetic"
                    id="wkLink"
                    href="#"
                    data-cursor="hover"
                  >
                    <span>View project</span>
                    <ArrowIcon />
                  </a>
                  <span className="work__count">
                    <b id="wkCur">01</b>
                    <i>/ 16</i>
                  </span>
                </div>
              </div>
            </div>

            {/* Scrolling right: project images */}
            <div className="work__right" id="workRight">
              {PROJECTS.map((p, i) => (
                <a
                  key={p.img}
                  className={"wk" + (i === 0 ? " is-active" : "")}
                  href="#"
                  data-cursor="view"
                  data-name={p.name}
                  data-cat={p.cat}
                  data-desc={p.desc}
                >
                  <div className="wk__media">
                    <img src={`/Images/${p.img}.webp`} alt={p.alt} loading="lazy" />
                  </div>
                  <div className="wk__cap">
                    <h4>{p.name}</h4>
                    <span>{p.cat}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ===== LOCATIONS MARQUEE ===== */}
        <section className="marquee marquee--alt" aria-hidden="true">
          <div className="marquee__track" id="marquee2">
            <span>USA</span><i>—</i><span>Canada</span><i>—</i><span>Dubai</span>
            <i>—</i><span>Australia</span><i>—</i><span>Singapore</span><i>—</i>
            <span>New Zealand</span><i>—</i><span>Philippines</span><i>—</i>
            <span>USA</span><i>—</i><span>Canada</span><i>—</i><span>Dubai</span>
            <i>—</i><span>Australia</span><i>—</i><span>Singapore</span><i>—</i>
            <span>New Zealand</span><i>—</i><span>Philippines</span><i>—</i>
          </div>
        </section>

        {/* ===== PROCESS — horizontal scroll-stacked card timeline ===== */}
        <section className="process" id="process">
          {/* Tall track: its scroll length is what the cards animate across */}
          <div className="process__scroll" id="processScroll">
            <div className="process__sticky">
              <div className="section-head">
                <span className="section-head__tag" data-reveal>
                  (03) — How I Work
                </span>
                <h2 className="section-head__title" data-reveal>
                  A process that<span className="accent"> ships.</span>
                </h2>
              </div>
              {/* Cards are stacked absolutely; each slides in from the right
                  as you scroll (driven by initProcessTimeline in animations.js) */}
              <div className="process__cards" id="processCards">
                {STEPS.map((s, i) => (
                  <article className="pcard" key={i}>
                    <div className="pcard__title">
                      <span className="pcard__no">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="pcard__body">
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== TECH STRIP ===== */}
        <section className="tech">
          <span className="tech__label" data-reveal>
            Built with a modern stack
          </span>
          <div className="tech__marquee" aria-hidden="true">
            {/* Content duplicated so the xPercent 0→-50% loop is seamless */}
            <div className="marquee__track tech__track" id="techMarquee">
              {[...TECH, ...TECH].map((t, i) => (
                <Fragment key={i}>
                  <span>{t}</span>
                  <i>✦</i>
                </Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA / CONTACT ===== */}
        <section className="cta" id="contact">
          <div className="cta__inner">
            <span className="cta__tag" data-reveal>
              (04) — Let&apos;s Build
            </span>
            <h2 className="cta__title">
              <span className="line">Got a project</span>
              <span className="line">
                in <span className="italic accent">mind?</span>
              </span>
            </h2>
            <a
              href="mailto:info@projectweb.net"
              className="cta__mail magnetic"
              data-cursor="hover"
            >
              <span>info@projectweb.net</span>
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <div className="cta__channels">
              <a
                href="https://wa.me/639298370289"
                target="_blank"
                rel="noopener"
                data-cursor="hover"
              >
                WhatsApp
              </a>
              <a href="viber://chat?number=%2B639298370289" data-cursor="hover">
                Viber
              </a>
              <a
                href="https://www.instagram.com/projectwebbyghale"
                target="_blank"
                rel="noopener"
                data-cursor="hover"
              >
                Instagram
              </a>
              <a href="#" target="_blank" rel="noopener" data-cursor="hover">
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer sits behind the content and is revealed as the last section scrolls up */}
      <footer className="footer">
        {/* City marquee */}
        <div className="footer__cities" aria-hidden="true">
          <div className="footer__cities-track" id="footerMarquee">
            <span>Manila<sup>PH</sup></span>
            <span>NYC<sup>US</sup></span>
            <span>Toronto<sup>CA</sup></span>
            <span>Dubai<sup>AE</sup></span>
            <span>Sydney<sup>AU</sup></span>
            <span>Singapore<sup>SG</sup></span>
            <span>Auckland<sup>NZ</sup></span>
            <span>Manila<sup>PH</sup></span>
            <span>NYC<sup>US</sup></span>
            <span>Toronto<sup>CA</sup></span>
            <span>Dubai<sup>AE</sup></span>
            <span>Sydney<sup>AU</sup></span>
            <span>Singapore<sup>SG</sup></span>
            <span>Auckland<sup>NZ</sup></span>
          </div>
        </div>

        <div className="footer__inner">
          <div className="footer__contact">
            <div className="footer__block">
              <span>Project Web by Ghale</span>
              <span className="footer__muted">Philippines — Worldwide</span>
            </div>
            <div className="footer__block footer__block--mid">
              <a href="tel:+639298370289">Tel +63 929 837 0289</a>
            </div>
            <div className="footer__block footer__block--end">
              <a href="mailto:info@projectweb.net">info@projectweb.net</a>
            </div>
          </div>

          <div className="footer__meta">
            <div className="footer__socials">
              <a
                href="https://www.instagram.com/projectwebbyghale"
                target="_blank"
                rel="noopener"
                data-cursor="hover"
              >
                ↳ Instagram
              </a>
              <a href="#" target="_blank" rel="noopener" data-cursor="hover">
                ↳ LinkedIn
              </a>
              <a href="#" target="_blank" rel="noopener" data-cursor="hover">
                ↳ Facebook
              </a>
            </div>
            <div className="footer__legal">
              © <span id="year"></span>, Project Web by Ghale. All rights reserved.{" "}
              <a href="#hero" data-cursor="hover">
                Back to top ↑
              </a>
            </div>
          </div>
        </div>

        {/* Oversized wordmark */}
        <div className="footer__big" aria-hidden="true">
          Project<span className="accent">Web</span>
        </div>
      </footer>

      {/* Floating skip button — appears from the 5th project while the Work
          section is in view (toggled in initWorkSkip); jumps to Process. */}
      <a
        href="#process"
        className="work__skip"
        id="workSkip"
        data-cursor="hover"
        aria-label="Seen enough? Skip ahead to the next section"
      >
        <span>Seen enough? Skip ahead</span>
        <ArrowIcon />
      </a>

      {/* ===== SERVICE IMAGE POPUP ===== */}
      {/* Reusable lightbox — a clicked service feeds its image in (see
          initServicesPopup in animations.js) */}
      <div className="svc-popup" id="svcPopup" aria-hidden="true" role="dialog" aria-modal="true">
        <div className="svc-popup__backdrop" data-svc-close></div>
        <div className="svc-popup__panel">
          <button className="svc-popup__close" data-svc-close aria-label="Close image">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {/* src/alt set imperatively on open */}
          <img id="svcPopupImg" src="" alt="" />
        </div>
      </div>
    </>
  );
}
