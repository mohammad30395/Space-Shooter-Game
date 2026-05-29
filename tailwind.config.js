/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./game/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Arial", "sans-serif"],
        body: ["var(--font-body)", "Arial", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 28px rgba(34, 211, 238, 0.24)",
        magenta: "0 0 30px rgba(217, 70, 239, 0.22)"
      },
      screens: {
        xs: "420px"
      }
    }
  },
  plugins: []
};
