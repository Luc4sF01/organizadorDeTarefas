import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Mapeados para variáveis CSS — mudam com o tema
        bg:      'var(--bg)',
        surface: 'var(--surface)',
        high:    'var(--surface-high)',
        hover:   'var(--hover)',
        bd: {
          dim:     'var(--border-dim)',
          DEFAULT: 'var(--border)',
          hi:      'var(--border-hi)',
        },
        tx: {
          DEFAULT: 'var(--tx)',
          2: 'var(--tx-2)',
          3: 'var(--tx-3)',
          4: 'var(--tx-4)',
          5: 'var(--tx-5)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hi:  'var(--accent-hi)',
          sub: 'var(--accent-sub)',
        },
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeOut:   { from: { opacity: '1' }, to: { opacity: '0' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(8px)'  }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        checkPop:  { '0%': { transform: 'scale(0)' }, '60%': { transform: 'scale(1.2)' }, '100%': { transform: 'scale(1)' } },
      },
      animation: {
        'fade-in':    'fadeIn 0.15s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'slide-up':   'slideUp 0.2s ease-out',
        'scale-in':   'scaleIn 0.15s ease-out',
        'check-pop':  'checkPop 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
export default config
