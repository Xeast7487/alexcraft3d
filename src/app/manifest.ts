import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AlexCraft3D",
    short_name: "AC3D",
    description: "Gestion des commandes d'impression 3D",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1117",
    theme_color: "#6366f1",
    icons: [
      { src: "/icon", sizes: "192x192", type: "image/png" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
