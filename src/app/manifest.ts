import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Focus Guardian AI",
    short_name: "FocusGuardian",
    description: "AI-powered deep work accountability and cognitive optimization system.",
    start_url: "/",
    display: "standalone",
    background_color: "#080b12",
    theme_color: "#080b12",
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
