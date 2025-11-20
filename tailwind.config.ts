import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6FFF5',
          100: '#B3FFE0',
          200: '#80FFCC',
          300: '#4DFFB8',
          400: '#1AFFA3',
          500: '#00E68A',
          600: '#00B36B',
          700: '#00804D',
          800: '#004D2E',
          900: '#001A10',
        },
        secondary: {
          50: '#E6F2F7',
          100: '#B3D9E8',
          200: '#80C0D9',
          300: '#4DA7CA',
          400: '#1A8EBB',
          500: '#0075A2',
          600: '#005C7F',
          700: '#00435C',
          800: '#002A39',
          900: '#001116',
        },
      },
    },
  },
  plugins: [],
};

export default config;
