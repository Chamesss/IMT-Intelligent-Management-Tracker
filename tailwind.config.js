/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: 'true',
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        'blue-mode': {
          DEFAULT: '#007BFF',
          light: '#60A5FA',
          dark: '#1E3A8A',
          background: '#E0F2FF',
          text: '#FFFFFF',
          border: '#0056b3',
          accent: '#4A90E2',
          hover: '#0056b3',
          disabled: '#A5D3FF'
        },
        custom: '#E6E4F0',
        lightGray: '#A3AED0',
        mediumGray: '#9896A3',
        darkGray: '#333',
        inProgress: '#0E9B1D',
        inReview: '#D3B412',
        blocked: '#FF0000',
        high: '#FF2C2C',
        medium: '#FF9C26',
        low: '#9D9BA1',
        searchInput: '#F9F8FF',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
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
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        default: '1.364rem'
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
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite'
      },
      fontFamily: {
        dm: ['DM Sans', 'sans-serif'],
        comic: ['Comic Neue"', 'sans-serif']
      },
      fontSize: {
        md: '1.125rem'
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right, #ec4899 0%, #a855f7 50%, #43e8e8 100%)'
      },
      borderColor: {
        custom: '#f1f0f6'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addVariant, e }) {
      addVariant('blue-mode', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.blue-mode .${e(`blue-mode${separator}${className}`)}`
        })
      })
    }
  ]
}
