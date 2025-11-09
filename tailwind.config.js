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
          DEFAULT: '#16a34a', // green-600
          light: '#22c55e',   // green-500
          dark: '#15803d',    // green-700
        },
        loss: {
          DEFAULT: '#dc2626', // red-600
          light: '#ef4444',   // red-500
          dark: '#b91c1c',    // red-700
        },
        revenue: {
          DEFAULT: '#64748b', // slate-500
          light: '#94a3b8',   // slate-400
        },
        // UI accent colors
        accent: {
          DEFAULT: '#0369a1', // sky-700
          hover: '#075985',   // sky-800
        },
        // Status indicator colors
        status: {
          profitable: '#22c55e',
          warning: '#f59e0b',
          caution: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
      },
      fontSize: {
        'hero': ['3rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h1': ['2.25rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h2': ['1.5rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h3': ['1.25rem', { lineHeight: '1.25', fontWeight: '600' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}
