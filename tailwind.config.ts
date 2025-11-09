import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ✅ L-2修正版: 02_functional_requirements.mdと統一
        focus: '#3b82f6', // Focus mode (blue-500)
        shortBreak: '#10b981', // Short break (green-500)
        longBreak: '#f97316', // Long break (orange-500)
        background: '#ffffff', // White
        surface: '#f3f4f6', // gray-100
        text: '#1f2937', // gray-800
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
