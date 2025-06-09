
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#00afb9',
					50: '#e6f7f9',
					100: '#b3eaef',
					200: '#80dde5',
					300: '#4dd0db',
					400: '#1ac3d1',
					500: '#00afb9',
					600: '#009ba6',
					700: '#008793',
					800: '#007380',
					900: '#005f6d',
					foreground: '#ffffff'
				},
				secondary: {
					DEFAULT: '#0081a7',
					50: '#e6f2f7',
					100: '#b3d9e8',
					200: '#80c0d9',
					300: '#4da7ca',
					400: '#1a8ebb',
					500: '#0081a7',
					600: '#00739c',
					700: '#006591',
					800: '#005786',
					900: '#00497b',
					foreground: '#ffffff'
				},
				dark: {
					DEFAULT: '#004860',
					50: '#e6e6e6',
					100: '#b3b3b3',
					200: '#808080',
					300: '#4d4d4d',
					400: '#1a1a1a',
					500: '#004860',
					600: '#003f56',
					700: '#00364c',
					800: '#002d42',
					900: '#002438',
					foreground: '#ffffff'
				},
				destructive: {
					DEFAULT: '#ef4444',
					foreground: '#ffffff'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontSize: {
				'title': ['32px', { lineHeight: '1.2', fontWeight: '300' }],
				'section': ['24px', { lineHeight: '1.3', fontWeight: '500' }],
				'subtitle': ['18px', { lineHeight: '1.4', fontWeight: '500' }],
				'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
				'label': ['14px', { lineHeight: '1.4', fontWeight: '500' }],
				'table': ['14px', { lineHeight: '1.4', fontWeight: '600' }],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
