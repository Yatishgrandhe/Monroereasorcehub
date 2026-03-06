import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./lib/**/*.{js,ts,jsx,tsx,mdx}',
		'./hooks/**/*.{js,ts,jsx,tsx,mdx}',
	],
	darkMode: ['class'],
	theme: {
		extend: {
			colors: {
				primary: {
					'50': '#f0f4f8',
					'100': '#d9e2ec',
					'200': '#bcccdc',
					'300': '#9fb3c8',
					'400': '#829ab1',
					'500': '#627d98',
					'600': '#486581',
					'700': '#334e68',
					'800': '#243b53',
					'900': '#102a43',
					'950': '#002147', // Deep Navy
					DEFAULT: '#002147',
					foreground: '#ffffff'
				},
				secondary: {
					'50': '#f7fcf9',
					'100': '#eefaf2',
					'200': '#d6f0df',
					'300': '#ade0be',
					'400': '#7cc894',
					'500': '#4ca96a',
					'600': '#388e51',
					'700': '#2b733f',
					'800': '#1b4d3e', // Forest Green
					'900': '#143b2f',
					'950': '#0a1d17',
					DEFAULT: '#1b4d3e',
					foreground: '#ffffff'
				},
				accent: {
					'50': '#fffbeb',
					'100': '#fef3c7',
					'200': '#fde68a',
					'300': '#fcd34d',
					'400': '#fbbf24',
					'500': '#f59e0b',
					'600': '#d97706',
					'700': '#b45309',
					'800': '#92400e',
					'900': '#78350f',
					'950': '#451a03',
					amber: '#FFBF00',
					gold: '#D4AF37',
					DEFAULT: '#FFBF00',
					foreground: '#002147'
				},
				surface: {
					'50': '#fcfcfc',
					'100': '#f7f7f7',
					'200': '#eeeeee',
					'300': '#e0e0e0',
					'400': '#bdbdbd',
					'500': '#9e9e9e',
					'600': '#757575',
					'700': '#616161',
					'800': '#424242',
					'900': '#212121'
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
			},
			fontFamily: {
				sans: [
					'Source Sans Pro',
					'Inter',
					'sans-serif'
				],
				serif: [
					'Merriweather',
					'Playfair Display',
					'serif'
				],
				display: [
					'Merriweather',
					'Playfair Display',
					'serif'
				]
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.3s ease-out',
				'bounce-gentle': 'bounceGentle 2s infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideUp: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				bounceGentle: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				}
			},
			boxShadow: {
				soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
				civic: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'civic-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
};

export default config;

