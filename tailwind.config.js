/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Lumin color system (matching current app)
        primary: '#000000',
        secondary: '#1a1a1a',
        text: {
          primary: 'rgba(255, 255, 255, 0.9)',
          secondary: 'rgba(255, 255, 255, 0.7)',
          muted: 'rgba(255, 255, 255, 0.5)',
        },
        border: '#333333',
        shadow: 'rgba(0, 0, 0, 0.3)',
        
        // Premium pastel colors
        pastel: {
          yellow: '#fef3c7',
          pink: '#fce7f3',
          blue: '#e0e7ff',
          green: '#dcfce7',
          coral: '#fed7d7',
          purple: '#ede9fe',
          orange: '#fed7aa',
          mint: '#d1fae5',
        },
        
        // Free mode grays
        gray: {
          free: {
            100: '#2d2d2d',
            200: '#3a3a3a',
            300: '#4a4a4a',
            400: '#5a5a5a',
            500: '#6a6a6a',
          }
        }
      },
      backgroundImage: {
        'gradient-rainbow': 'linear-gradient(135deg, #fef3c7 0%, #fce7f3 25%, #e0e7ff 50%, #dcfce7 75%, #fed7d7 100%)',
        'gradient-grayscale': 'linear-gradient(135deg, #2d2d2d 0%, #3a3a3a 25%, #4a4a4a 50%, #5a5a5a 75%, #6a6a6a 100%)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'task-enter': 'taskEnter 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'task-complete': 'taskComplete 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'task-delete': 'taskDelete 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'task-shift': 'taskShift 0.3s ease-out',
        'confetti': 'confetti 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'ripple': 'ripple 1s ease-out forwards',
        'glow-pulse': 'glowPulse 1s ease-out',
        'rainbow-shift': 'rainbowShift 4s ease-in-out infinite',
      },
      keyframes: {
        taskEnter: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '50%': { opacity: '0.8', transform: 'translateY(-2px) scale(1.02)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        taskComplete: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)', marginBottom: '1rem', padding: '4px' },
          '20%': { opacity: '0.9', transform: 'translateY(-8px) scale(1.02)' },
          '60%': { opacity: '0.6', transform: 'translateY(-25px) scale(0.98)' },
          '80%': { opacity: '0.3', transform: 'translateY(-35px) scale(0.94)' },
          '100%': { opacity: '0', transform: 'translateY(-50px) scale(0.9)', marginBottom: '0', padding: '0', height: '0' },
        },
        taskDelete: {
          '0%': { opacity: '1', transform: 'translateX(0) scale(1)', marginBottom: '1rem', padding: '4px' },
          '20%': { opacity: '0.8', transform: 'translateX(-10px) scale(0.98)' },
          '60%': { opacity: '0.4', transform: 'translateX(-30px) scale(0.94)' },
          '100%': { opacity: '0', transform: 'translateX(-50px) scale(0.9)', marginBottom: '0', padding: '0', height: '0' },
        },
        taskShift: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
          '100%': { transform: 'translateY(0)' },
        },
        confetti: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(0) rotate(0deg)' },
          '20%': { opacity: '1', transform: 'translateY(-10px) scale(1) rotate(72deg)' },
          '80%': { opacity: '1', transform: 'translateY(-30px) scale(0.8) rotate(288deg)' },
          '100%': { opacity: '0', transform: 'translateY(-50px) scale(0) rotate(360deg)' },
        },
        ripple: {
          '0%': { opacity: '0.8', transform: 'scale(0)' },
          '50%': { opacity: '0.4', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(2)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(168, 85, 247, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(168, 85, 247, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(168, 85, 247, 0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}