/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aljeri-blue': '#0A3D62',
        'aljeri-green': '#18A999',
        'asphalt-gray': {
          '100': '#F7F7F7',
          '200': '#E5E5E5',
          '800': '#2D3748',
        }
      }
    },
  },
  plugins: [],
}