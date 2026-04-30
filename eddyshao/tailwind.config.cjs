/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Rubik", "sans-serif"],
      },
      keyframes: {
        drop: {
          from: { transform: "translateY(-5rem)" },
          to: { transform: "translateY(0px)" },
        },
      },
      animation: {
        "connect-four-drop": "drop 1s linear",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: ["pastel", "light"],
    logs: true,
    utils: true,
  },
};
