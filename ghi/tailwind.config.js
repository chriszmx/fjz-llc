module.exports = {
  darkMode: 'class',
  purge: {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ]
  },
  theme: {
    extend: {},
  },
  plugins: [
    require('postcss-nesting'),
    require('tailwindcss'),
  ],
}



// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
