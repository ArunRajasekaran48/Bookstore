/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { 50:'#fdf4e7', 100:'#fbe3bf', 200:'#f7c97a', 300:'#f4b040', 400:'#f09a1a', 500:'#e07b00', 600:'#b86000', 700:'#8f4900', 800:'#663300', 900:'#3d1f00' },
        accent:  { 50:'#e8f4f8', 100:'#c5e3ef', 200:'#8dc6df', 300:'#55aacf', 400:'#2d93bf', 500:'#1a7fa8', 600:'#136588', 700:'#0d4c68', 800:'#083548', 900:'#041e29' },
        dark:    { 50:'#f5f5f0', 100:'#e8e8df', 200:'#d0d0c0', 300:'#b0b09a', 400:'#90907a', 500:'#70705a', 600:'#565645', 700:'#3d3d30', 800:'#25251e', 900:'#131310' }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'book': '4px 4px 0px 0px rgba(0,0,0,0.15)',
        'book-hover': '6px 6px 0px 0px rgba(0,0,0,0.2)'
      }
    }
  },
  plugins: []
}
