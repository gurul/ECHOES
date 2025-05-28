import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
        'scale-out': 'scaleOut 0.3s ease-in',
        shimmer: 'shimmer 3s infinite',
        'wave-slow': 'wave-slow 8s infinite',
        'wave-slower': 'wave-slower 12s infinite',
        'wave-fast': 'wave-fast 6s infinite',
        'pulse-slow': 'pulse-slow 4s infinite',
        'falling-star': 'fallingStar 3s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-10px) translateX(5px)' },
          '50%': { transform: 'translateY(0) translateX(10px)' },
          '75%': { transform: 'translateY(10px) translateX(5px)' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'wave-slow': {
          '0%': { transform: 'translateX(-100%) translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateX(0) translateY(-10%) rotate(5deg)' },
          '100%': { transform: 'translateX(100%) translateY(0) rotate(0deg)' }
        },
        'wave-slower': {
          '0%': { transform: 'translateX(-100%) translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateX(0) translateY(10%) rotate(-5deg)' },
          '100%': { transform: 'translateX(100%) translateY(0) rotate(0deg)' }
        },
        'wave-fast': {
          '0%': { transform: 'translateX(-100%) translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateX(0) translateY(-5%) rotate(3deg)' },
          '100%': { transform: 'translateX(100%) translateY(0) rotate(0deg)' }
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.1)' }
        },
        fallingStar: {
          '0%': { 
            transform: 'translateY(0) translateX(0) rotate(45deg)',
            opacity: '0'
          },
          '5%': { 
            opacity: '1'
          },
          '100%': { 
            transform: 'translateY(100vh) translateX(100px) rotate(45deg)',
            opacity: '0'
          }
        },
        glowPulse: {
          '0%, 100%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' }
        }
      },
      perspective: {
        '1000': '1000px',
      },
      rotate: {
        'y-6': 'rotateY(6deg)',
        'x-2': 'rotateX(2deg)',
      },
      translate: {
        'z-2': 'translateZ(2px)',
        'z-4': 'translateZ(4px)',
        'z-6': 'translateZ(6px)',
        'z-8': 'translateZ(8px)',
        'z-12': 'translateZ(12px)',
      },
    },
  },
  plugins: [],
};

export default config; 