/** @type {import('tailwindcss').Config} */
export default {
  // 告訴 Tailwind 去哪裡尋找我們寫的 class 名稱
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
