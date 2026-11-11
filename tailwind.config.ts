// Meadow tokens for Tailwind. The values are CSS variables from src/styles/tokens.css, so both vibes work.
// Merge "extend" into a project's tailwind.config.ts (Lovable does this when the design system is attached).
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)', ink: 'var(--ink)', 'ink-soft': 'var(--ink-soft)', 'ink-muted': 'var(--ink-muted)', 'on-action': 'var(--ink-on-action)',
        action: 'var(--action)', 'action-end': 'var(--action-end)', glass: 'var(--glass)', 'glass-strong': 'var(--glass-strong)', 'glass-sheet': 'var(--glass-sheet)',
        line: 'var(--line)', 'line-strong': 'var(--line-strong)', focus: 'var(--focus)',
        success: 'var(--success)', 'success-bg': 'var(--success-bg)', warning: 'var(--warning)', 'warning-bg': 'var(--warning-bg)', danger: 'var(--danger)', 'danger-bg': 'var(--danger-bg)',
        leaf: 'var(--leaf-300)', lagoon: 'var(--lagoon-300)', sand: 'var(--sand-400)',
      },
      fontFamily: { display: ['var(--font-display)'], sans: ['var(--font-sans)'] },
      borderRadius: { sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)', xl: 'var(--radius-xl)', pill: 'var(--radius-pill)' },
      boxShadow: { glass: 'var(--shadow-glass)', float: 'var(--shadow-float)', sheet: 'var(--shadow-sheet)', button: 'var(--shadow-button)', knob: 'var(--shadow-knob)' },
      backgroundImage: { action: 'var(--gradient-action)', aqua: 'var(--gradient-aqua)', meadow: 'var(--backdrop-meadow)' },
      transitionTimingFunction: { soft: 'cubic-bezier(.2,.8,.2,1)', spring: 'cubic-bezier(.34,1.56,.64,1)' },
      transitionDuration: { fast: '120ms', base: '240ms', enter: '360ms', slow: '420ms' },
    },
  },
};
