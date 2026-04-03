/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    // Override default fontFamily (not extend) to make HindSiliguri the default
    fontFamily: {
      sans: ["HindSiliguri_400Regular", "sans-serif"],
      light: ["HindSiliguri_300Light", "sans-serif"],
      medium: ["HindSiliguri_500Medium", "sans-serif"],
      semibold: ["HindSiliguri_600SemiBold", "sans-serif"],
      bold: ["HindSiliguri_700Bold", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#10B981",
        background: "#F8FAFC",
        accent: "#F59E0B",
        text: "#1E293B",
      },
    },
  },
  plugins: [],
};
