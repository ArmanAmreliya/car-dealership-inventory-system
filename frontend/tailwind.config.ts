import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand palette - Mint, Soft Teal, Slate, Charcoal, Dark Neutral
        white: '#FFFFFF',
        mint: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        accent: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        // Muted status colors (Available -> Soft Mint, Reserved -> Lavender, Pending -> Neutral Gray, Low Stock -> Muted Gold, Error -> Soft Rose)
        badge: {
          available: { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' },
          reserved: { bg: '#EDE9FE', text: '#5B21B6', border: '#DDD6FE' },
          pending: { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' },
          lowStock: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
          error: { bg: '#FFE4E6', text: '#991B1B', border: '#FECDD3' },
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#F43F5E',
          info: '#0D9488',
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'popover': '0 10px 30px -5px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.08)',
        'drawer': '-10px 0 30px -5px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
} satisfies Config;

