/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      animation: {
        "card-glow": "cardGlow 2s infinite",
      },
      keyframes: {
        cardGlow: {
          "0%, 100%": {
            boxShadow:
              "0 0 5px rgba(234, 179, 8, 0.2), 0 0 10px rgba(234, 179, 8, 0.2), 0 0 15px rgba(234, 179, 8, 0.2)",
          },
          "50%": {
            boxShadow:
              "0 0 10px rgba(234, 179, 8, 0.3), 0 0 20px rgba(234, 179, 8, 0.3), 0 0 30px rgba(234, 179, 8, 0.3)",
          },
        },
      },
    },
  },
  plugins: [],
};
