/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // Luxury Look palette
        surface: {
          DEFAULT: '#F5F5F5',
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
        },
        dark: {
          DEFAULT: '#121212',
          50: '#2A2A2A',
          100: '#1E1E1E',
          200: '#181818',
          300: '#121212',
          400: '#0A0A0A',
        },
        accent: {
          DEFAULT: '#FF6B2B',
          light: '#FF8A55',
          dark: '#E55A1F',
          50: 'rgba(255, 107, 43, 0.08)',
          100: 'rgba(255, 107, 43, 0.15)',
        },
        silver: {
          DEFAULT: '#C0C0C0',
          light: '#D4D4D4',
          dark: '#9E9E9E',
        },
        // Keep primary alias for existing Tailwind classes
        primary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF6B2B',
          600: '#FF6B2B',
          700: '#E55A1F',
          800: '#C2410C',
          900: '#9A3412',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        'card-hover': '0 8px 25px rgba(0,0,0,0.08), 0 2px 10px rgba(0,0,0,0.04)',
        'glow': '0 4px 15px rgba(255, 107, 43, 0.3)',
        'glow-hover': '0 6px 20px rgba(255, 107, 43, 0.4)',
      },
    },
  },
  plugins: [],
};
