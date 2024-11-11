import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      },
      colors: {
        customRed: {
          50: "#ffe6e6",
          100: "#ffb3b3",
          200: "#ff9999",
          300: "#ff8080",
          400: "#ff6666",
          500: "#ff6d6d",
          600: "#e65c5c",
          700: "#cc4d4d",
          800: "#b33d3d",
          900: "#992d2d"
        }
      }
    }
  },
  plugins: []
};
export default config;
