import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827", muted: "#667085", canvas: "#fbfafb", line: "#e5e7eb",
        navy: "#091426", blue: "#2563eb", lavender: "#edf3ff", panel: "#f4f3f5",
      },
      boxShadow: { card: "0 12px 30px rgba(15,23,42,.08)", soft: "0 3px 18px rgba(15,23,42,.06)" },
      maxWidth: { app: "1440px" },
    },
  },
  plugins: [],
};

export default config;
