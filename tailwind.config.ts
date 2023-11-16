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
        blue: "#3b82f6",
        red: "#ef4444",
        green: "#22c55e",
        yellow: "#eab308",
        "dark-blue": "#1e293b",
      },
      screens: { rs: "450px" },
      boxShadow: {
        dashboard: "0px 0px 0px 1000px #3b82f6",
      },
    },
  },
  plugins: [],
};
export default config;
