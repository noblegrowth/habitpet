/** @type {import('tailwindcss').Config} */
//
// Palette = "Cozy Craft Stop-Motion" needle-felted wool tones (see docs/DESIGN_SYSTEM.md).
// Token NAMES are kept (sky/grass/golden/coral/grape/cream/ink) so existing
// component classes restyle automatically; only their VALUES shift to muted,
// warm, matte wool colors. No neon, no gloss.
//
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // warm off-white seamless paper / cloth
        cream: "#F4EDE0",
        paper: "#F7F1E6",
        // dusty-blue wool (was sky)
        sky: {
          soft: "#CBD9DD",
          DEFAULT: "#9DB7C0",
          deep: "#6E94A1",
        },
        // sage / moss wool (was grass)
        grass: {
          soft: "#CBD6B8",
          DEFAULT: "#A6BB8B",
          deep: "#7E9A63",
        },
        // honey / mustard wool (was golden)
        golden: {
          soft: "#F0DEAE",
          DEFAULT: "#E3C271",
          deep: "#CFA23F",
        },
        // terracotta / clay wool (was coral)
        coral: {
          soft: "#EFC4B3",
          DEFAULT: "#DD9B81",
          deep: "#C27457",
        },
        // heather / plum wool (was grape)
        grape: {
          soft: "#D8CCDD",
          DEFAULT: "#B6A2C2",
          deep: "#8E7AA0",
        },
        // warm dark brown thread (was cold ink)
        ink: "#4A4036",
      },
      fontFamily: {
        display: ['"Baloo 2"', '"Nunito"', 'system-ui', 'ui-rounded', 'sans-serif'],
        body: ['"Nunito"', 'system-ui', 'ui-rounded', 'sans-serif'],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        // soft, warm ambient-occlusion shadows (matte studio lighting)
        soft: "0 14px 28px -16px rgba(74, 64, 54, 0.45)",
        tile: "0 10px 0 0 rgba(74, 64, 54, 0.10)",
        // selected-state: a warm felt halo, NOT a neon glow
        glow: "0 0 0 4px rgba(194, 116, 87, 0.35), 0 16px 30px -16px rgba(74,64,54,0.5)",
        // tight contact shadow beneath a subject (weight / presence)
        contact: "0 8px 10px -6px rgba(74, 64, 54, 0.5)",
      },
      keyframes: {
        // "On twos" stop-motion idle — a gentle stepped breathe/bob.
        "felt-idle": {
          "0%":   { transform: "translateY(0) rotate(0deg)" },
          "20%":  { transform: "translateY(-3px) rotate(-1.2deg)" },
          "45%":  { transform: "translateY(-5px) rotate(0deg)" },
          "70%":  { transform: "translateY(-2px) rotate(1.2deg)" },
          "100%": { transform: "translateY(0) rotate(0deg)" },
        },
        // Bouncier stepped hop for selected / celebratory states.
        "felt-hop": {
          "0%":   { transform: "translateY(0) rotate(-2deg) scale(1)" },
          "25%":  { transform: "translateY(-10px) rotate(0deg) scale(1.03)" },
          "50%":  { transform: "translateY(-2px) rotate(2deg) scale(1)" },
          "75%":  { transform: "translateY(-7px) rotate(0deg) scale(1.02)" },
          "100%": { transform: "translateY(0) rotate(-2deg) scale(1)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "70%": { transform: "scale(1.04)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-up": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
      },
      animation: {
        // step-end timing gives the discrete, claymation "on twos" feel.
        "felt-idle": "felt-idle 2s step-end infinite",
        "felt-hop": "felt-hop 1s step-end infinite",
        "pop-in": "pop-in 0.35s ease-out both",
        "fade-up": "fade-up 0.45s ease-out both",
        wiggle: "wiggle 0.5s ease-in-out 2",
      },
    },
  },
  plugins: [],
}
