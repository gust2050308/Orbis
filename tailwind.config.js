/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        // Animaciones de flotación
        'float-slow': 'float 15s ease-in-out infinite',
        'float-medium': 'float 12s ease-in-out infinite 2s',
        'float-fast': 'float 10s ease-in-out infinite 1s',
        'float-delayed': 'float-delayed 20s ease-in-out infinite',
        
        // Animaciones de pulso
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'pulse-medium': 'pulse 3s ease-in-out infinite 1.5s',
        
        // Animaciones de gradiente
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { 
            transform: 'translate(0, 0) scale(1)',
          },
          '25%': { 
            transform: 'translate(30px, -30px) scale(1.1)',
          },
          '50%': { 
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '75%': { 
            transform: 'translate(40px, 10px) scale(1.05)',
          },
        },
        'float-delayed': {
          '0%, 100%': { 
            transform: 'translate(0, 0) scale(1)',
          },
          '25%': { 
            transform: 'translate(-40px, 30px) scale(1.1)',
          },
          '50%': { 
            transform: 'translate(30px, -20px) scale(0.9)',
          },
          '75%': { 
            transform: 'translate(-30px, -15px) scale(1.05)',
          },
        },
        pulse: {
          '0%, 100%': { 
            opacity: '0.3',
          },
          '50%': { 
            opacity: '0.7',
          },
        },
        gradientShift: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        }
      },
      backgroundSize: {
        '200-auto': '200% auto',
      }
    },
  },
  plugins: [],
}