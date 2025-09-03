/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ให้ Tailwind สแกนทุกไฟล์ใน src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};