import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0f1117",
        surface: "#1a1d27",
        border: "#2a2d3a",
        muted: "#6b7280",
        accent: "#6366f1",
        "accent-hover": "#5254cc",
        "status-print": "#f97316",
        "status-cours": "#3b82f6",
        "status-livre": "#22c55e",
      },
    },
  },
  plugins: [],
};
export default config;
