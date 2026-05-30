/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 取自设计规范 / 参考截图
        'xhs-red': '#FF2442',
        'xhs-red-press': '#E51F3A',
        'xhs-pink': '#FBC4CC',
        'ask-blue': '#017AFC',
        'ink': '#1A1A1A',
        'ink-regular': '#333333',
        'ink-sub': '#888888',
        'ink-ph': '#B2B2B2',
        'fill-chip': '#F4F4F5',
        'fill-input': '#F7F7F8',
        'line': '#EBEBEB',
        'hl': '#FFF4D6',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', '"SF Pro Text"', '"Helvetica Neue"', 'sans-serif'],
      },
      borderRadius: { sheet: '20px' },
      boxShadow: { sheet: '0 -2px 20px rgba(0,0,0,.08)' },
    },
  },
  plugins: [],
}
