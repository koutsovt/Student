/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ltu: {
          red: '#C8102E',
          navy: '#1F2A44',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#F5F7FA',
        },
        border: {
          DEFAULT: '#E5E7EB',
        },
        muted: {
          DEFAULT: '#6B7280',
        },
        success: '#0F7B5C',
        amber: {
          alert: '#B45309',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(31, 42, 68, 0.04), 0 4px 12px rgba(31, 42, 68, 0.06)',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        typingDot: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-3px)', opacity: '1' },
        },
      },
      animation: {
        'pulse-soft': 'pulseSoft 1.6s ease-in-out infinite',
        'typing-dot': 'typingDot 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
