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
        bg:             "#0c0c0c",
        surface:        "#131313",
        border:         "#1e1e1e",
        muted:          "#555555",
        accent:         "#f26217",
        "accent-hover": "#d45510",
        "status-print": "#f97316",
        "status-cours": "#3b82f6",
        "status-livre": "#22c55e",
      },
    },
  },
  plugins: [],
};
export default config;
