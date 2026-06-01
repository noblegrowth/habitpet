/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, playful HabitPet palette
        cream: "#FFF9F0",
        sky: {
          soft: "#BAE6FD",
          DEFAULT: "#7DD3FC",
          deep: "#38BDF8",
        },
        grass: {
          soft: "#BBF7D0",
          DEFAULT: "#86EFAC",
          deep: "#4ADE80",
        },
        golden: {
          soft: "#FEF3C7",
          DEFAULT: "#FDE68A",
          deep: "#FBBF24",
        },
        coral: {
          soft: "#FECACA",
          DEFAULT: "#FCA5A5",
          deep: "#FB7185",
        },
        grape: {
          soft: "#E9D5FF",
          DEFAULT: "#C4B5FD",
          deep: "#A78BFA",
        },
        ink: "#3F3A52",
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
        soft: "0 10px 30px -10px rgba(63, 58, 82, 0.25)",
        tile: "0 8px 0 0 rgba(63, 58, 82, 0.12)",
        glow: "0 0 40px -5px rgba(125, 211, 252, 0.6)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0px) rotate(-2deg)" },
          "50%": { transform: "translateY(-8px) rotate(2deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "70%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "fade-up": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        drift: {
          "0%": { transform: "translateX(-10%)" },
          "100%": { transform: "translateX(110%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        bob: "bob 3s ease-in-out infinite",
        wiggle: "wiggle 0.6s ease-in-out infinite",
        "pop-in": "pop-in 0.35s ease-out both",
        "fade-up": "fade-up 0.45s ease-out both",
        "drift-slow": "drift 40s linear infinite",
        "drift-slower": "drift 60s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
      },
    },
  },
  plugins: [],
}
