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
					'50': '#f1f6fb',
					'100': '#e1ecf7',
					'200': '#bed8f0',
					'300': '#87b9e5',
					'400': '#4995d5',
					'500': '#3461AD', // Brand Blue
					'600': '#264e8e',
					'700': '#203f73',
					'800': '#1d365f',
					'900': '#1d2f50',
					'950': '#131e34',
					DEFAULT: '#3461AD',
					foreground: '#ffffff'
				},
				secondary: {
					'50': '#fff1f1',
					'100': '#ffdfdf',
					'200': '#ffc4c4',
					'300': '#ff9c9c',
					'400': '#ff6b6b',
					'500': '#F06B62', // Brand Salmon
					'600': '#dc4c4c',
					'700': '#b93939',
					'800': '#993232',
					'900': '#802f2f',
					'950': '#461414',
					DEFAULT: '#F06B62',
					foreground: '#ffffff'
				},
				accent: {
					'50': '#f0fdf9',
					'100': '#ccfbf1',
					'200': '#99f6e4',
					'300': '#5eead4',
					'400': '#2dd4bf',
					'500': '#40C1AC', // Brand Teal
					'600': '#0d9488',
					'700': '#0f766e',
					'800': '#115e59',
					'900': '#134e4a',
					'950': '#042f2e',
					DEFAULT: '#40C1AC',
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

