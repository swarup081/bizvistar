/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            DEFAULT: '#8A63D2', // Allows usage like bg-brand, text-brand
            50: '#f4f1fa',
            100: '#e8e2f5',
            200: '#d1c5eb',
            300: '#b9a8e0',
            400: '#a28ad6',
            500: '#8a63d2', // Base Theme Color
            600: '#7554b3',
            700: '#5c428c',
            800: '#453269',
            900: '#2e2146',
            950: '#171123',
          },
        },
      },
    },
    plugins: [],
  };