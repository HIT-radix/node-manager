/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        dark: {
          // full list of available color vars at https://daisyui.com/docs/colors/
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#242d20",
          secondary: "#A0D490",
          accent: "#ffffff",
          // neutral: "#a5b6c8",
          "base-100": "#000400",
          "base-200": "#091007",
          "base-content": "#293a24",

          // "--rounded-btn": "0",
          "--btn-text-case": "none",
          // "--rounded-box": "0.25rem",
        },
        colors: {
          orange: "#FF6A25",
          blue: "#8FB9FC",
          pink: "#cd42ff",
          borderColor: "#29364D",
        },
      },
    ],
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  },
  plugins: [require("daisyui")],
};
