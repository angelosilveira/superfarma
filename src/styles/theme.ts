
export const theme = {
  colors: {
    primary: {
      50: '#e6f7f9',
      100: '#b3eaef',
      200: '#80dde5',
      300: '#4dd0db',
      400: '#1ac3d1',
      500: '#00afb9', // Main brand color
      600: '#009ba6',
      700: '#008793',
      800: '#007380',
      900: '#005f6d',
    },
    secondary: {
      50: '#e6f2f7',
      100: '#b3d9e8',
      200: '#80c0d9',
      300: '#4da7ca',
      400: '#1a8ebb',
      500: '#0081a7', // Secondary brand
      600: '#00739c',
      700: '#006591',
      800: '#005786',
      900: '#00497b',
    },
    dark: {
      50: '#e6e6e6',
      100: '#b3b3b3',
      200: '#808080',
      300: '#4d4d4d',
      400: '#1a1a1a',
      500: '#004860', // Dark brand
      600: '#003f56',
      700: '#00364c',
      800: '#002d42',
      900: '#002438',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  typography: {
    title: {
      fontSize: '32px',
      fontWeight: '300',
      lineHeight: '1.2',
    },
    section: {
      fontSize: '24px',
      fontWeight: '500',
      lineHeight: '1.3',
    },
    subtitle: {
      fontSize: '18px',
      fontWeight: '500',
      lineHeight: '1.4',
    },
    body: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.5',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '1.4',
    },
    table: {
      fontSize: '14px',
      fontWeight: '600',
      lineHeight: '1.4',
      textTransform: 'uppercase' as const,
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
} as const;

export type Theme = typeof theme;
