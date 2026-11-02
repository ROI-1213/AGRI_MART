/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        agrimart: {
          green: '#0d9749',
          darkgreen: '#097b3a',
          lightgreen: '#e8f5e9',
          yellow: '#f59e0b',
          red: '#dc2626',
          header: '#333333',
          border: '#e2e8f0',
          text: '#222222',
          muted: '#666666',
        }
      }
    },
  },
  plugins: [],
}
