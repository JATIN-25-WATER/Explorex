import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-clash)', 'sans-serif'],
        body: ['var(--font-satoshi)', 'sans-serif'],
      },
      colors: {
        surface: '#0e0e10',
        card: '#18181c',
        border: '#2a2a30',
        accent: '#ff5c35',
        'accent-soft': '#ff7a5a',
        muted: '#6b6b75',
        subtle: '#3a3a42',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
export default config
