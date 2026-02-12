/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#DC2626",        // Main brand
          light: "#FEE2E2",          // Background red-100
          foreground: "#FFFFFF",     // White text
        },
        secondary: {
          DEFAULT: "#FEE2E2",
          foreground: "#991B1B",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
