import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tribal Scholarship Connect",
    short_name: "Scholarship Connect",
    description: "Discover, apply for and track tribal student scholarships.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fbfc",
    theme_color: "#0b4d6c",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  }
}