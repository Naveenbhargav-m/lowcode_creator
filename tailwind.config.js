/** @type {import('tailwindcss').Config} */
const colors = require('./src/styles/colors');

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html", "node_modules/preline/dist/*.js"],
  theme: {
    extend: {
      colors: {
        ...colors,
      },
    },
  },
  plugins: [
    require("daisyui"),
    require('preline/plugin'),
    require('@tailwindcss/forms')],
};
