/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        beige: "#F5F5DC",
        "light-gray": "#D3D3D3",
        brown: "#8B4513",
        "mint-green": "#98FB98",
        "light-blue": "#ADD8E6",
        sand: "#F4A460",
      },
      fontFamily: {
        sans: ["Helvetica", "Arial", "sans-serif"],
      },
      borderWidth: {
        DEFAULT: "1px",
        0: "0",
        2: "2px",
        3: "3px",
        4: "4px",
        6: "6px",
        8: "8px",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        none: "0",
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.5rem",
        full: "9999px",
      },
    },
  },
  variants: {
    extend: {
      textColor: ["responsive", "hover", "focus", "group-hover"],
      borderColor: ["responsive", "hover", "focus", "group-hover"],
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/line-clamp"),
  ],

  daisyui: {
    themes: ["japandi"],
  },
};
