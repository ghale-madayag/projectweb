/** @type {import('next').NextConfig} */
const nextConfig = {
  // The page is driven by imperative GSAP/Lenis DOM code. Strict Mode's
  // double-invoke of effects in dev would double-register ScrollTriggers,
  // so we disable it (production renders once regardless).
  reactStrictMode: false,
};

export default nextConfig;
