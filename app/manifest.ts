import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ceren's PA",
    short_name: "Ceren's PA",
    description: "Personal Assistant of Ceren",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f1e8",
    theme_color: "#f5f1e8",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}