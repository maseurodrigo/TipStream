import withMT from "@material-tailwind/react/utils/withMT";

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        space: ["SpaceGrotesk", "sans-serif"],
      },
      colors: {
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5dc",
          400: "#99a1af",
          500: "#6a7282",
          600: "#4a5565",
          700: "#364153",
          800: "#1e2939",
          900: "#101828",
          950: "#030712"
        }
      }
    }
  },
  plugins: []
});