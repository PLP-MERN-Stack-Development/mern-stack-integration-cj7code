/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d3b66',    // Deep navy
        secondary: '#0f766e',  // Muted teal
        accent: '#14b8a6',     // Bright teal
        background: '#f9fafb', // Light background
        textPrimary: '#1e293b',// Slate text
        textLight: '#e2e8f0',  // Light text for dark bg
      },
    },
  },
  plugins: [],
}
