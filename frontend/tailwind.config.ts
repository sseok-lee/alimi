import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3780f6',
          hover: '#2563eb',
          light: '#60a5fa',
        },
        background: {
          light: '#f5f7f8',
          dark: '#101722',
        },
        surface: {
          light: '#ffffff',
          dark: '#1a2230',
        },
        text: {
          primary: '#111418',
          secondary: '#60708a',
          muted: '#9ca3af',
        },
        // 카테고리별 배지 색상
        badge: {
          finance: {
            bg: '#eff6ff',
            text: '#3780f6',
            border: '#dbeafe',
          },
          housing: {
            bg: '#fff7ed',
            text: '#ea580c',
            border: '#fed7aa',
          },
          employment: {
            bg: '#faf5ff',
            text: '#9333ea',
            border: '#e9d5ff',
          },
          transport: {
            bg: '#f0fdfa',
            text: '#0d9488',
            border: '#99f6e4',
          },
          culture: {
            bg: '#fdf2f8',
            text: '#db2777',
            border: '#fbcfe8',
          },
          education: {
            bg: '#ecfdf5',
            text: '#059669',
            border: '#a7f3d0',
          },
          health: {
            bg: '#fef2f2',
            text: '#dc2626',
            border: '#fecaca',
          },
        },
      },
      fontFamily: {
        display: ['Manrope', 'Noto Sans KR', 'sans-serif'],
        sans: ['Noto Sans KR', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.08)',
        card: '0 4px 12px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.15)',
        'primary-glow': '0 4px 14px rgba(55, 128, 246, 0.3)',
      },
    },
  },
  plugins: [],
} satisfies Config
