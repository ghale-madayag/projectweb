import "./globals.css";

/* Single source of truth for the production URL (used by metadata + JSON-LD) */
const SITE_URL = "https://projectweb.net";

/* ⚠️ GOOGLE SEARCH CONSOLE
   Verify ownership via the "HTML tag" method:
   1. Search Console → Add property → choose "URL prefix" → https://projectweb.net
   2. Pick "HTML tag" verification. Google shows:
        <meta name="google-site-verification" content="XXXXXXXXXXXXXXXX" />
   3. Copy ONLY the content value and paste it below, then deploy.
   4. Back in Search Console, click "Verify".
   (Leaving the placeholder is harmless but will NOT verify.) */
const GOOGLE_SITE_VERIFICATION = "REPLACE_WITH_YOUR_GSC_VERIFICATION_CODE";

const DESCRIPTION =
  "Project Web by Ghale — a boutique web design & development studio. I don't just develop; I design with an artist's eye and a coder's precision, crafting fast, custom websites & web apps for clients worldwide.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Project Web by Ghale — Web Design & Development Studio",
    template: "%s — Project Web by Ghale",
  },
  description: DESCRIPTION,
  applicationName: "Project Web by Ghale",
  authors: [{ name: "Ghale", url: SITE_URL }],
  creator: "Ghale",
  publisher: "Project Web by Ghale",
  keywords: [
    "web design",
    "web development",
    "web design studio",
    "custom websites",
    "web apps",
    "UI/UX design",
    "Laravel developer",
    "Vue.js developer",
    "WordPress developer",
    "e-commerce websites",
    "freelance web developer",
    "Philippines web developer",
    "Project Web by Ghale",
    "Ghale",
  ],
  alternates: {
    canonical: "/",
  },
  category: "technology",
  icons: {
    icon: "/Project Web Logo.png",
    shortcut: "/Project Web Logo.png",
    apple: "/Project Web Logo.png",
  },
  openGraph: {
    title: "Project Web by Ghale — Web Design & Development Studio",
    description:
      "I don't just develop; I design with an artist's eye and a coder's precision. Fast, custom websites & web apps for clients worldwide.",
    url: SITE_URL,
    siteName: "Project Web by Ghale",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/Project Web Logo.png",
        alt: "Project Web by Ghale — Web Design & Development Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Project Web by Ghale — Web Design & Development Studio",
    description:
      "I don't just develop; I design with an artist's eye and a coder's precision.",
    images: ["/Project Web Logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport = {
  themeColor: "#9772cc",
};

/* Structured data — helps Google show a rich, accurate result for the studio. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#studio`,
  name: "Project Web by Ghale",
  alternateName: "Project Web",
  description: DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/Project Web Logo.png`,
  logo: `${SITE_URL}/Project Web Logo.png`,
  email: "info@projectweb.net",
  telephone: "+63 929 837 0289",
  priceRange: "$$",
  founder: { "@type": "Person", name: "Ghale" },
  areaServed: "Worldwide",
  address: { "@type": "PostalAddress", addressCountry: "PH" },
  sameAs: ["https://www.instagram.com/projectwebbyghale"],
  knowsAbout: [
    "Web Design",
    "Web Development",
    "UI/UX Design",
    "E-Commerce",
    "Laravel",
    "Vue.js",
    "Inertia.js",
    "WordPress",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,600&family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
