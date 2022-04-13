const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.red[500],
        primaryDark: colors.red[700],
        secondary: colors.blue[300],
        white: colors.white,
        black: colors.black,
        stream1: colors.blue[500],
        stream2: colors.orange[400],
      }
    },
  },
  plugins: [],
}