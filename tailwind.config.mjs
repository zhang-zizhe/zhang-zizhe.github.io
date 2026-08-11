/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--c-ink) / <alpha-value>)',
        muted: 'rgb(var(--c-muted) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        panel: 'rgb(var(--c-panel) / <alpha-value>)',
        panelSoft: 'rgb(var(--c-panel-soft) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-code)', 'var(--font-cjk)'],
        serif: ['var(--font-code)', 'var(--font-cjk)'],
        mono: ['var(--font-code)', 'var(--font-cjk)'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(152, 240, 140, 0.18), 0 22px 64px rgba(0, 0, 0, 0.35)',
        'glow-light': '0 0 0 1px rgba(56, 114, 224, 0.12), 0 22px 64px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
