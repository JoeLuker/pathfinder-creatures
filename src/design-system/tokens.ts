// Design Tokens - Single Source of Truth for Design System
// Following industry standards: semantic naming, consistent scales, accessibility

const designTokens = {
  // Color Palette - Pathfinder-themed with accessibility in mind
  colors: {
    // Base colors from HSL values for precise control
    slate: {
      50: 'hsl(210, 40%, 98%)', // noqa
      100: 'hsl(210, 40%, 96%)', // noqa
      200: 'hsl(214, 32%, 91%)', // noqa
      300: 'hsl(213, 27%, 84%)', // noqa
      400: 'hsl(215, 20%, 65%)', // noqa
      500: 'hsl(215, 16%, 47%)', // noqa
      600: 'hsl(215, 19%, 35%)', // noqa
      700: 'hsl(215, 25%, 27%)', // noqa
      800: 'hsl(217, 33%, 17%)', // noqa
      900: 'hsl(222, 47%, 11%)', // noqa
      950: 'hsl(222, 84%, 5%)', // noqa
    },

    // Pathfinder brand colors - rich, fantasy-themed palette
    amber: {
      50: 'hsl(48, 100%, 96%)', // noqa
      100: 'hsl(48, 96%, 89%)', // noqa
      200: 'hsl(48, 97%, 77%)', // noqa
      300: 'hsl(46, 97%, 65%)', // noqa
      400: 'hsl(43, 96%, 56%)', // noqa
      500: 'hsl(38, 92%, 50%)', // Primary gold // noqa
      600: 'hsl(32, 95%, 44%)', // noqa
      700: 'hsl(26, 90%, 37%)', // noqa
      800: 'hsl(23, 83%, 31%)', // noqa
      900: 'hsl(22, 78%, 26%)', // noqa
      950: 'hsl(21, 91%, 14%)', // noqa
    },

    // Deep red for danger/combat
    red: {
      50: 'hsl(0, 86%, 97%)', // noqa
      100: 'hsl(0, 93%, 94%)', // noqa
      200: 'hsl(0, 96%, 89%)', // noqa
      300: 'hsl(0, 94%, 82%)', // noqa
      400: 'hsl(0, 91%, 71%)', // noqa
      500: 'hsl(0, 84%, 60%)', // noqa
      600: 'hsl(0, 72%, 51%)', // noqa
      700: 'hsl(0, 74%, 42%)', // noqa
      800: 'hsl(0, 70%, 35%)', // noqa
      900: 'hsl(0, 63%, 31%)', // noqa
      950: 'hsl(0, 75%, 15%)', // noqa
    },

    // Forest green for nature/druids
    emerald: {
      50: 'hsl(151, 81%, 96%)', // noqa
      100: 'hsl(149, 80%, 90%)', // noqa
      200: 'hsl(152, 76%, 80%)', // noqa
      300: 'hsl(156, 72%, 67%)', // noqa
      400: 'hsl(158, 64%, 52%)', // noqa
      500: 'hsl(160, 84%, 39%)', // noqa
      600: 'hsl(161, 94%, 30%)', // noqa
      700: 'hsl(163, 94%, 24%)', // noqa
      800: 'hsl(163, 88%, 20%)', // noqa
      900: 'hsl(164, 86%, 16%)', // noqa
      950: 'hsl(166, 91%, 9%)', // noqa
    },

    // Deep blue for magic/wizards
    sapphire: {
      50: 'hsl(214, 100%, 97%)', // noqa
      100: 'hsl(214, 95%, 93%)', // noqa
      200: 'hsl(213, 97%, 87%)', // noqa
      300: 'hsl(212, 96%, 78%)', // noqa
      400: 'hsl(213, 94%, 68%)', // noqa
      500: 'hsl(217, 91%, 60%)', // noqa
      600: 'hsl(221, 83%, 53%)', // noqa
      700: 'hsl(224, 76%, 48%)', // noqa
      800: 'hsl(226, 71%, 40%)', // noqa
      900: 'hsl(224, 64%, 33%)', // noqa
      950: 'hsl(226, 65%, 21%)', // noqa
    },

    // Purple for arcane magic
    violet: {
      50: 'hsl(270, 100%, 98%)', // noqa
      100: 'hsl(269, 100%, 95%)', // noqa
      200: 'hsl(269, 100%, 92%)', // noqa
      300: 'hsl(269, 97%, 85%)', // noqa
      400: 'hsl(270, 95%, 75%)', // noqa
      500: 'hsl(271, 91%, 65%)', // noqa
      600: 'hsl(271, 81%, 56%)', // noqa
      700: 'hsl(272, 72%, 47%)', // noqa
      800: 'hsl(272, 67%, 39%)', // noqa
      900: 'hsl(273, 66%, 32%)', // noqa
      950: 'hsl(274, 87%, 21%)', // noqa
    },
  },

  // Semantic color mapping
  semantic: {
    // Surface colors
    background: {
      primary: 'var(--color-background)',
      secondary: 'var(--color-surface-secondary)',
      tertiary: 'var(--color-surface-tertiary)',
      overlay: 'var(--color-surface-overlay)',
    },

    // Text colors
    text: {
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
      tertiary: 'var(--color-text-tertiary)',
      inverse: 'var(--color-text-inverse)',
      disabled: 'var(--color-text-disabled)',
    },

    // Interactive colors
    interactive: {
      primary: 'var(--color-interactive-primary)',
      'primary-hover': 'var(--color-interactive-primary-hover)',
      'primary-active': 'var(--color-interactive-primary-active)',
      secondary: 'var(--color-interactive-secondary)',
      'secondary-hover': 'var(--color-interactive-secondary-hover)',
      danger: 'var(--color-interactive-danger)',
      'danger-hover': 'var(--color-interactive-danger-hover)',
    },

    // Status colors
    status: {
      success: 'var(--color-status-success)',
      warning: 'var(--color-status-warning)',
      error: 'var(--color-status-error)',
      info: 'var(--color-status-info)',
    },

    // Border colors
    border: {
      primary: 'var(--color-border-primary)',
      secondary: 'var(--color-border-secondary)',
      focus: 'var(--color-border-focus)',
      error: 'var(--color-border-error)',
    },
  },

  // Typography scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      display: ['Cinzel', 'serif'], // For fantasy headers
    },

    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
    },

    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },

    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // Spacing scale (base-8 system)
  spacing: {
    0: '0',
    1: '0.25rem', // 4px
    2: '0.5rem',  // 8px
    3: '0.75rem', // 12px
    4: '1rem',    // 16px
    5: '1.25rem', // 20px
    6: '1.5rem',  // 24px
    8: '2rem',    // 32px
    10: '2.5rem', // 40px
    12: '3rem',   // 48px
    16: '4rem',   // 64px
    20: '5rem',   // 80px
    24: '6rem',   // 96px
    32: '8rem',   // 128px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    default: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Shadows
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },

  // Animation & Transition
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  // Z-index layers
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
};

// Theme variants
export const themes = {
  light: {
    name: 'light',
    colors: {
      // Surface colors
      'color-background': designTokens.colors.slate[50],
      'color-surface-secondary': designTokens.colors.slate[100],
      'color-surface-tertiary': designTokens.colors.slate[200],
      'color-surface-overlay': 'hsla(0, 0%, 0%, 0.5)', // noqa

      // Text colors
      'color-text-primary': designTokens.colors.slate[900],
      'color-text-secondary': designTokens.colors.slate[600],
      'color-text-tertiary': designTokens.colors.slate[500],
      'color-text-inverse': designTokens.colors.slate[50],
      'color-text-disabled': designTokens.colors.slate[400],

      // Interactive colors
      'color-interactive-primary': designTokens.colors.amber[500],
      'color-interactive-primary-hover': designTokens.colors.amber[600],
      'color-interactive-primary-active': designTokens.colors.amber[700],
      'color-interactive-secondary': designTokens.colors.slate[200],
      'color-interactive-secondary-hover': designTokens.colors.slate[300],
      'color-interactive-danger': designTokens.colors.red[500],
      'color-interactive-danger-hover': designTokens.colors.red[600],

      // Status colors
      'color-status-success': designTokens.colors.emerald[500],
      'color-status-warning': designTokens.colors.amber[500],
      'color-status-error': designTokens.colors.red[500],
      'color-status-info': designTokens.colors.sapphire[500],

      // Border colors
      'color-border-primary': designTokens.colors.slate[300],
      'color-border-secondary': designTokens.colors.slate[200],
      'color-border-focus': designTokens.colors.amber[500],
      'color-border-error': designTokens.colors.red[500],
    },
  },

  dark: {
    name: 'dark',
    colors: {
      // Surface colors
      'color-background': designTokens.colors.slate[950],
      'color-surface-secondary': designTokens.colors.slate[900],
      'color-surface-tertiary': designTokens.colors.slate[800],
      'color-surface-overlay': 'hsla(0, 0%, 0%, 0.7)', // noqa

      // Text colors
      'color-text-primary': designTokens.colors.slate[50],
      'color-text-secondary': designTokens.colors.slate[400],
      'color-text-tertiary': designTokens.colors.slate[500],
      'color-text-inverse': designTokens.colors.slate[900],
      'color-text-disabled': designTokens.colors.slate[600],

      // Interactive colors
      'color-interactive-primary': designTokens.colors.amber[400],
      'color-interactive-primary-hover': designTokens.colors.amber[300],
      'color-interactive-primary-active': designTokens.colors.amber[200],
      'color-interactive-secondary': designTokens.colors.slate[700],
      'color-interactive-secondary-hover': designTokens.colors.slate[600],
      'color-interactive-danger': designTokens.colors.red[400],
      'color-interactive-danger-hover': designTokens.colors.red[300],

      // Status colors
      'color-status-success': designTokens.colors.emerald[400],
      'color-status-warning': designTokens.colors.amber[400],
      'color-status-error': designTokens.colors.red[400],
      'color-status-info': designTokens.colors.sapphire[400],

      // Border colors - Back to slate 600 to test
      'color-border-primary': designTokens.colors.slate[600],
      'color-border-secondary': designTokens.colors.slate[900],
      'color-border-focus': designTokens.colors.amber[400],
      'color-border-error': designTokens.colors.red[400],
    },
  },
};

export type Theme = keyof typeof themes;
export type ThemeConfig = typeof themes[Theme];