/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            spacing: {
                '72': '18rem',  // Añadir m-72 (288px)
                '80': '20rem',  // Añadir m-80 (320px)
                '96': '24rem',  // Añadir m-96 (384px)
                '104': '26rem', // Añadir m-104 (416px)
                '112': '28rem', // Añadir m-112 (448px)
                '120': '30rem', // Añadir m-120 (480px)
            },
        },
    },
    plugins: [],
}

