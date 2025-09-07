/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'hsl(210, 80%, 95%)',
          100: 'hsl(210, 80%, 90%)',
          200: 'hsl(210, 80%, 80%)',
          300: 'hsl(210, 80%, 70%)',
          400: 'hsl(210, 80%, 60%)',
          500: 'hsl(210, 80%, 50%)',
          600: 'hsl(210, 80%, 40%)',
          700: 'hsl(210, 80%, 30%)',
          800: 'hsl(210, 80%, 20%)',
          900: 'hsl(210, 80%, 10%)',
        },
        accent: {
          50: 'hsl(160, 60%, 95%)',
          100: 'hsl(160, 60%, 90%)',
          200: 'hsl(160, 60%, 80%)',
          300: 'hsl(160, 60%, 70%)',
          400: 'hsl(160, 60%, 55%)',
          500: 'hsl(160, 60%, 45%)',
          600: 'hsl(160, 60%, 35%)',
          700: 'hsl(160, 60%, 25%)',
          800: 'hsl(160, 60%, 15%)',
          900: 'hsl(160, 60%, 5%)',
        },
        background: 'hsl(210, 20%, 95%)',
        surface: 'hsl(0, 0%, 100%)',
        textPrimary: 'hsl(210, 20%, 15%)',
        textSecondary: 'hsl(210, 15%, 45%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
      },
      spacing: {
        sm: '8px',
        md: '12px',
        lg: '20px',
      },
      boxShadow: {
        card: '0 4px 12px hsla(210, 20%, 20%, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 250ms cubic-bezier(0.22,1,0.36,1)',
        'slide-up': 'slideUp 400ms cubic-bezier(0.22,1,0.36,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}