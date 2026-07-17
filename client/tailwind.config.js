/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF6F5",
        blush: "#FFE3ED",
        hotpink: "#E0218A",
        magenta: "#FF5CA8",
        plum: "#4A1942",
        gold: "#F4C95D",
        lilac: "#C9A7EB",
        mint: "#8FE3D6",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        script: ["Pacifico", "cursive"],
        body: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        "ribbon-grad": "linear-gradient(135deg, #FF5CA8 0%, #E0218A 60%, #C9257E 100%)",
        "hero-grad": "radial-gradient(circle at 20% 20%, #FFE3ED 0%, #FFF6F5 45%, #F4C95D22 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(224, 33, 138, 0.15)",
        "glass-lg": "0 20px 60px -10px rgba(74, 25, 66, 0.25)",
      },
      borderRadius: {
        ticket: "18px",
      },
    },
  },
  plugins: [],
};
