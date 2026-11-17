/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        os: {
          bg: 'var(--color-bg)',
          card: 'var(--color-card)',
          'card-hover': 'var(--color-card-hover)',
          'card-subtle': 'var(--color-card-subtle)',
          border: 'var(--color-border)',
          'border-light': 'var(--color-border-light)',
          'border-subtle': 'var(--color-border-subtle)',
          accent: 'var(--color-accent)',
          'accent-hover': 'var(--color-accent-hover)',
          'accent-subtle': 'var(--color-accent-subtle)',
          'accent-glow': 'var(--color-accent-glow)',
          'accent-secondary': 'var(--color-accent-secondary)',
          text: 'var(--color-text)',
          'text-muted': 'var(--color-text-muted)',
          'text-subtle': 'var(--color-text-subtle)',
          'text-inverse': 'var(--color-text-inverse)',
          dock: 'var(--color-dock)',
          window: 'var(--color-window)',
          
          /* Semantic Colors */
          success: 'var(--color-success)',
          'success-subtle': 'var(--color-success-subtle)',
          'success-border': 'var(--color-success-border)',
          'success-text': 'var(--color-success-text)',
          
          warning: 'var(--color-warning)',
          'warning-subtle': 'var(--color-warning-subtle)',
          'warning-border': 'var(--color-warning-border)',
          'warning-text': 'var(--color-warning-text)',
          
          error: 'var(--color-error)',
          'error-subtle': 'var(--color-error-subtle)',
          'error-border': 'var(--color-error-border)',
          'error-text': 'var(--color-error-text)',
          
          info: 'var(--color-info)',
          'info-subtle': 'var(--color-info-subtle)',
          'info-border': 'var(--color-info-border)',
          'info-text': 'var(--color-info-text)',
        }
      },
      borderRadius: {
        'xs': 'var(--radius-xs, 0.25rem)',
        'sm': 'var(--radius-sm, 0.375rem)',
        'md': 'var(--radius-md, 0.5rem)',
        'lg': 'var(--radius-lg, 0.75rem)',
        'xl': 'var(--radius-xl, 1rem)',
        '2xl': 'var(--radius-2xl, 1.25rem)',
        '3xl': 'var(--radius-3xl, 1.5rem)',
        'full': 'var(--radius-full, 9999px)',
      },
      boxShadow: {
        'elevation-1': 'var(--shadow-elevation-1)',
        'elevation-2': 'var(--shadow-elevation-2)',
        'elevation-3': 'var(--shadow-elevation-3)',
        'elevation-4': 'var(--shadow-elevation-4)',
        'elevation-5': 'var(--shadow-elevation-5)',
        'window': 'var(--shadow-window)',
        'window-focused': 'var(--shadow-window-focused)',
        'dock': 'var(--shadow-dock)',
        'neon': '0 0 20px var(--color-accent-glow)',
      },
      zIndex: {
        'windows-min': '10',
        'windows-max': '50',
        'dock': '60',
        'topbar': '65',
        'modal': '70',
        'toast': '80',
        'boot': '100',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        'spring-smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring-snappy': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s infinite ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 16s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '25%': { transform: 'scale(1.4)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.9' },
          '75%': { transform: 'scale(1)', opacity: '0.6' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
