/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: "Roboto_500Medium",
        subtitle: "Roboto_500Medium",
        body: "Roboto_400Regular",
        bold: "Roboto_700Bold"
      }
    },
  },
  colors: {
    background: {
      primary: '#E1E1E6'
    },
    blackshadow: 'rgba(0,0,0, 0.8)',
    primary: {
      700: '#92A0AD'
    },
    secondary: {
      700: '#213A5C'
    },
    blue: {
      800: '#0d1c30',
      700: '#0E2038',
      500: '#213A5C',
      300: '#758F99',
      200: '#90A4B0',
      100: '#EEF4ED'
    },
    zinc: {
      700: 'rgba(0,0,0, 0.8)'
    },
    gray: {
      700: '#121214',
      600: '#202024',
      500: '#29292E',
      400: '#323238',
      300: '#7C7C8A',
      200: '#C4C4CC',
      150: '#D9D9D9',
      100: '#E1E1E6'
    },
    green: {
      500: '#007b00',
      300: '#92e27a'
    },
    white: '#FFFFFF',
  },
  plugins: [],
}