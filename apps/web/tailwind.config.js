/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Modern dark theme palette
                'dark': {
                    'bg': '#0F1419',
                    'card': '#1A202D',
                    'border': '#2D3748',
                },
                // Modern brand colors - Primary: Navy/Slate Blue
                'brand': {
                    'primary': '#2563EB',      // Bright Blue
                    'primary-dark': '#1E40AF',
                    'primary-light': '#3B82F6',
                    'secondary': '#64748B',    // Slate Gray
                    'accent': '#10B981',       // Mint Green (subtle success)
                    'warning': '#F59E0B',      // Warm Amber (soft warning)
                },
                // Supporting colors
                'neutral': {
                    'text': '#F1F5F9',
                    'text-muted': '#CBD5E1',
                    'bg-hover': '#334155',
                },
                // Gradient colors
                'glow': {
                    'emerald': '#10B981',
                    'blue': '#2563EB',
                    'cyan': '#06B6D4',
                    'yellow': '#FBBF24',
                },
            },
            fontSize: {
                // Futuristic font scales
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '3.5rem' }],
            },
            animation: {
                // Smooth micro-animations
                'glow-pulse': 'glow-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow-grow': 'glow-grow 2s ease-in-out infinite',
                'glow-fade': 'glow-fade 2s ease-in-out infinite',
                'slide-in': 'slide-in 0.3s ease-out',
                'slide-up': 'slide-up 0.4s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                'scale-up': 'scale-up 0.3s ease-out',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                'glow-grow': {
                    '0%': { boxShadow: '0 0 8px rgba(255, 30, 30, 0.3)' },
                    '50%': { boxShadow: '0 0 20px rgba(255, 30, 30, 0.5)' },
                    '100%': { boxShadow: '0 0 8px rgba(255, 30, 30, 0.3)' },
                },
                'glow-fade': {
                    '0%': { opacity: '0.3' },
                    '50%': { opacity: '1' },
                    '100%': { opacity: '0.3' },
                },
                'slide-in': {
                    '0%': { transform: 'translateX(-100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'scale-up': {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            boxShadow: {
                // Modern glow shadows using brand colors
                'glow-primary': '0 0 20px rgba(37, 99, 235, 0.3)',
                'glow-primary-lg': '0 0 30px rgba(37, 99, 235, 0.4)',
                'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.3)',
                'glow-blue': '0 0 20px rgba(37, 99, 235, 0.3)',
                'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
            },
            transitionDuration: {
                // 200ms micro-animations
                '200': '200ms',
            },
            backdropBlur: {
                'xs': '2px',
            },
            opacity: {
                '2': '0.02',
                '3': '0.03',
                '5': '0.05',
                '10': '0.1',
            },
        },
    },
    plugins: [],
}
