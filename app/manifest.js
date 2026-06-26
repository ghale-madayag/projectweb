/* Generates /manifest.webmanifest for mobile/PWA + richer install metadata. */
export default function manifest() {
  return {
    name: "Project Web by Ghale — Web Design & Development Studio",
    short_name: "Project Web",
    description:
      "Boutique web design & development studio. Fast, custom websites & web apps for clients worldwide.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#9772cc",
    icons: [
      {
        src: "/Project Web Logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
