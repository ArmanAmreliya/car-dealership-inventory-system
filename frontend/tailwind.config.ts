import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        foreground: '#0f172a',
        muted: {
          foreground: '#64748b',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
