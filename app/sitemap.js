/* Generates /sitemap.xml. Single-page site, so the homepage is the only URL. */
const SITE_URL = "https://projectweb.net";

export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
