const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,ts}"],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: "1rem",
                sm: "2rem",
                lg: "4rem",
                xl: "5rem",
                "2xl": "6rem",
            },
        },

        extend: {
            fontSize: {
                h1: "3.815rem",
                h2: "3.052rem",
                h3: "2.441rem",
                h4: "1.953rem",
                h5: "1.563rem",
                h6: "1.25rem",
                base: "16px",
                sm: "0.8rem",
            },

            colors: {
                "cream-white": "#F9F4E1",
                "bright-red": {
                    50: "#ff7373",
                    100: "#ff6969",
                    200: "#ff5f5f",
                    300: "#f65555",
                    400: "#ec4b4b",
                    500: "#e24141",
                    600: "#d83737",
                    700: "#ce2d2d",
                    800: "#c42323",
                    900: "#ba1919",
                },
                "brownish-gray": "#120E0E",
                "almost-black": "#0A0808",
                black: "#0A0808",
            },

            fontFamily: {
                heading: ['"Sintony"', ...defaultTheme.fontFamily.sans],
                body: ['"Poppins"', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [require("@tailwindcss/forms")({ strategy: "base" })],
};
