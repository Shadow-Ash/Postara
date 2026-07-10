import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],

  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      /*
      |--------------------------------------------------------------------------
      | Colors
      |--------------------------------------------------------------------------
      */

      colors: {
        primary: "#004AC6",
        "primary-container": "#2563EB",
        "primary-fixed": "#DBE1FF",
        "primary-fixed-dim": "#B4C5FF",

        secondary: "#585F6C",
        "secondary-container": "#DCE2F3",
        "secondary-fixed": "#DCE2F3",
        "secondary-fixed-dim": "#C0C7D6",

        tertiary: "#943700",
        "tertiary-container": "#BC4800",
        "tertiary-fixed": "#FFDBCD",
        "tertiary-fixed-dim": "#FFB596",

        background: "#FAF8FF",

        surface: "#FAF8FF",
        "surface-bright": "#FAF8FF",
        "surface-dim": "#D9D9E5",

        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F3F3FE",
        "surface-container": "#EDEDF9",
        "surface-container-high": "#E7E7F3",
        "surface-container-highest": "#E1E2ED",

        "surface-variant": "#E1E2ED",

        outline: "#737686",
        "outline-variant": "#C3C6D7",

        error: "#BA1A1A",
        "error-container": "#FFDAD6",

        "on-primary": "#FFFFFF",
        "on-primary-container": "#EEEFFF",
        "on-primary-fixed": "#00174B",
        "on-primary-fixed-variant": "#003EA8",

        "on-secondary": "#FFFFFF",
        "on-secondary-container": "#5E6572",
        "on-secondary-fixed": "#151C27",
        "on-secondary-fixed-variant": "#404754",

        "on-tertiary": "#FFFFFF",
        "on-tertiary-container": "#FFEDE6",
        "on-tertiary-fixed": "#360F00",
        "on-tertiary-fixed-variant": "#7D2D00",

        "on-background": "#191B23",
        "on-surface": "#191B23",
        "on-surface-variant": "#434655",

        "inverse-surface": "#2E3039",
        "inverse-on-surface": "#F0F0FB",
        "inverse-primary": "#B4C5FF",

        "surface-tint": "#0053DB",
      },

      /*
      |--------------------------------------------------------------------------
      | Font
      |--------------------------------------------------------------------------
      */

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      /*
      |--------------------------------------------------------------------------
      | Typography
      |--------------------------------------------------------------------------
      */

      fontSize: {
        display: [
          "48px",
          {
            lineHeight: "56px",
            fontWeight: "700",
          },
        ],

        h1: [
          "32px",
          {
            lineHeight: "40px",
            fontWeight: "700",
          },
        ],

        h2: [
          "24px",
          {
            lineHeight: "32px",
            fontWeight: "600",
          },
        ],

        h3: [
          "20px",
          {
            lineHeight: "28px",
            fontWeight: "600",
          },
        ],

        body: [
          "15px",
          {
            lineHeight: "24px",
          },
        ],

        label: [
          "13px",
          {
            lineHeight: "18px",
            fontWeight: "500",
          },
        ],

        caption: [
          "11px",
          {
            lineHeight: "16px",
            fontWeight: "600",
          },
        ],
      },

      /*
      |--------------------------------------------------------------------------
      | Radius
      |--------------------------------------------------------------------------
      */

      borderRadius: {
        DEFAULT: "6px",
        sm: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px",
        full: "9999px",
      },

      /*
      |--------------------------------------------------------------------------
      | Shadows
      |--------------------------------------------------------------------------
      */

      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,.03)",

        sm: "0 2px 6px rgba(0,0,0,.04)",

        md: "0 4px 12px rgba(0,0,0,.05)",

        lg: "0 8px 24px rgba(0,0,0,.08)",

        floating: "0 16px 40px rgba(0,0,0,.12)",
      },

      /*
      |--------------------------------------------------------------------------
      | Spacing
      |--------------------------------------------------------------------------
      */

      spacing: {
        "sidebar-primary": "64px",
        "sidebar-secondary": "240px",

        page: "40px",

        gutter: "24px",

        container: "800px",
      },

      /*
      |--------------------------------------------------------------------------
      | Transition
      |--------------------------------------------------------------------------
      */

      transitionDuration: {
        250: "250ms",
        400: "400ms",
      },

      /*
      |--------------------------------------------------------------------------
      | Animation
      |--------------------------------------------------------------------------
      */

      keyframes: {
        fade: {
          from: {
            opacity: "0",
          },

          to: {
            opacity: "1",
          },
        },

        scale: {
          from: {
            transform: "scale(.98)",
            opacity: "0",
          },

          to: {
            transform: "scale(1)",
            opacity: "1",
          },
        },
      },

      animation: {
        fade: "fade .25s ease",

        scale: "scale .2s ease",
      },
    },
  },

  plugins: [],
};

export default config;