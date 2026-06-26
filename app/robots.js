/* Generates /robots.txt and points crawlers at the sitemap. */
const SITE_URL = "https://projectweb.net";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
