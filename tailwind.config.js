const { tokens } = require("./src/styles/tokens")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",

  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],

  theme: {
    extend: {
      colors: {
        primary: tokens.colors.primary,
        "background-light": tokens.colors.background.light,
        "background-dark": tokens.colors.background.dark,
        "slate-card": tokens.colors.slate.card,
        "slate-border": tokens.colors.slate.border
      },

      borderRadius: tokens.radius,

      fontFamily: {
        display: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"]
      }
    }
  },

  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries")
  ]
}