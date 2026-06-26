import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://projectweb.net"),
  title: "Project Web by Ghale — Web Design & Development Studio",
  description:
    "Project Web by Ghale — a boutique web design & development studio. I don't just develop; I design with an artist's eye and a coder's precision. Crafting custom websites & web apps for clients worldwide.",
  icons: {
    icon: "/Project Web Logo.png",
  },
  openGraph: {
    title: "Project Web by Ghale — Web Design & Development Studio",
    description:
      "I don't just develop; I design with an artist's eye and a coder's precision.",
    type: "website",
    images: ["/Project Web Logo.png"],
  },
};

export const viewport = {
  themeColor: "#9772cc",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
