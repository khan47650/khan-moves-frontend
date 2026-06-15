/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'km-red': '#C0392B',
                'km-red-dark': '#922B21',
                'km-gold': '#D4AC0D',
                'km-gold-light': '#F1C40F',
                'km-dark': '#1a1a1a',
            },
            fontFamily: {
                sans: [
                    'Inter, system-ui, -apple-system, sans-serif',
                    {
                        fontFeatureSettings: '"cv11", "cv14"',
                    },
                ],
            },
            fontSize: {
                xs: ['11px', { lineHeight: '1.4' }],
                sm: ['13px', { lineHeight: '1.5' }],
                base: ['15px', { lineHeight: '1.6' }],
                lg: ['17px', { lineHeight: '1.6' }],
                xl: ['20px', { lineHeight: '1.6' }],
                '2xl': ['24px', { lineHeight: '1.5' }],
                '3xl': ['30px', { lineHeight: '1.4' }],
                '4xl': ['36px', { lineHeight: '1.3' }],
                '5xl': ['48px', { lineHeight: '1.1' }],
            },
            borderRadius: {
                'km-sm': '6px',
                'km-md': '8px',
                'km-lg': '12px',
            },
            boxShadow: {
                'km-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
                'km-md': '0 4px 6px rgba(0, 0, 0, 0.1)',
                'km-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
            },
        },
    },
    plugins: [],
};
