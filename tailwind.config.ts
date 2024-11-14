import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        trajan: ['TrajanPro', 'sans-serif'],
        cinzel: ['Cinzel', 'sans-serif']
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cardText: "#372B00",
      },
      keyframes: {
        errorEnter: {
          "0%": {transform:"translateX(-100%)"},
          "100%": {transform:"translateY(0%)"}
        }
      },
      animation: {
        errorEnter: "errorEnter 0.1s ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
