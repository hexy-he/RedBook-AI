/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'xhs-red': '#FF2442',
        'xhs-red-press': '#E51F3A',
        'xhs-pink': '#FBC4CC',
        'ask-blue': '#017AFC',
        'text-primary': '#1A1A1A',
        'text-regular': '#333333',
        'text-secondary': '#888888',
        'text-placeholder': '#B2B2B2',
        'fill-chip': '#F4F4F5',
        'fill-input': '#F7F7F8',
        'line': '#EBEBEB',
        'bg-page': '#FFFFFF',
        'highlight': '#FFF4D6',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', '"SF Pro Text"', '"Helvetica Neue"', 'sans-serif'],
      },
      borderRadius: {
        'pill': '999px',
      },
    },
  },
  plugins: [],
}
