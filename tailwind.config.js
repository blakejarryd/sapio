/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Status colors for data visualization
        profit: {
          DEFAULT: '#10b981', // emerald-500 - more vibrant
          light: '#34d399',   // emerald-400
          dark: '#059669',    // emerald-600
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        loss: {
          DEFAULT: '#ef4444', // red-500 - refined
          light: '#f87171',   // red-400
          dark: '#dc2626',    // red-600
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        revenue: {
          DEFAULT: '#71717a', // zinc-500 - more neutral
          light: '#a1a1aa',   // zinc-400
          dark: '#52525b',    // zinc-600
          100: '#f4f4f5',
          200: '#e4e4e7',
          400: '#a1a1aa',
          500: '#71717a',
        },
        // UI accent colors
        accent: {
          DEFAULT: '#0369a1', // sky-700
          hover: '#075985',   // sky-800
          light: '#0ea5e9',   // sky-500
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          700: '#0369a1',
          800: '#075985',
        },
        // Status indicator colors with opacity variants
        status: {
          profitable: '#10b981',
          warning: '#f59e0b',
          caution: '#ef4444',
        },
        // Surface colors
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'hero': ['3rem', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.02em' }],
        'h1': ['2.25rem', { lineHeight: '1.25', fontWeight: '600', letterSpacing: '-0.02em' }],
        'h2': ['1.5rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.01em' }],
        'h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0' }],
        'display-sm': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '3.5rem', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '4rem', fontWeight: '700', letterSpacing: '-0.02em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'lg': '0.75rem',  // 12px - softer corners
        'xl': '1rem',     // 16px
        '2xl': '1.25rem', // 20px
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-up': 'slideUp 200ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
