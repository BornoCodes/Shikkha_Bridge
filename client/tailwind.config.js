/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FDF2EF",
          100: "#FAE0D8",
          200: "#F5C1B1",
          300: "#EF9A82",
          400: "#D96A4A",
          DEFAULT: "#C84B31",
          600: "#B04029",
          700: "#8E3321",
          800: "#6D271A",
          900: "#4D1B12",
          950: "#2D1009",
        },
        secondary: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#F0BD2E",
          DEFAULT: "#E8A317",
          600: "#C88A13",
          700: "#A06E10",
          800: "#7A540D",
          900: "#54390A",
          950: "#2D1F05",
        },
        accent: {
          50: "#FDF2F7",
          100: "#FAE5EF",
          200: "#F5CBDF",
          300: "#EDA8C8",
          400: "#E18DB3",
          DEFAULT: "#D4789C",
          600: "#BF5D82",
          700: "#9E4668",
          800: "#7D3652",
          900: "#5C2A3E",
          950: "#3B1928",
        },
        background: "#FFF8F0",
        surface: "#F5E6D3",
        cream: {
          DEFAULT: "#FFF8F0",
          dark: "#FDF2EF",
        },
        parchment: {
          DEFAULT: "#F5E6D3",
          dark: "#EAD5BC",
        },
        terracotta: {
          DEFAULT: "#C84B31",
          light: "#D96A4A",
          dark: "#8E3321",
        },
        turmeric: {
          DEFAULT: "#E8A317",
          light: "#F0BD2E",
          dark: "#A06E10",
        },
        lotus: {
          DEFAULT: "#D4789C",
          light: "#E18DB3",
          dark: "#9E4668",
        },
        river: {
          DEFAULT: "#4A90A4",
          light: "#5FB3C4",
          dark: "#3D7488",
        },
        matti: {
          DEFAULT: "#2D1B0E",
          light: "#4A3526",
          lighter: "#6B5344",
        },
        water: {
          50: "#EFF8FA",
          100: "#D4EEF3",
          200: "#A9DDE7",
          300: "#7ECBD9",
          400: "#5FB3C4",
          DEFAULT: "#4A90A4",
          600: "#3D7488",
          700: "#315C6C",
          800: "#264550",
          900: "#1B2F37",
          950: "#101B20",
        },
      },
      fontFamily: {
        bengali: ['"Hind Siliguri"', "sans-serif"],
        heading: ['"Playfair Display"', "serif"],
        body: ['"Inter"', "sans-serif"],
      },
      backgroundImage: {
        "kantha-border":
          "repeating-linear-gradient(90deg, transparent, transparent 4px, #C84B31 4px, #C84B31 5px, transparent 5px, transparent 9px)",
        "kantha-border-vertical":
          "repeating-linear-gradient(0deg, transparent, transparent 4px, #C84B31 4px, #C84B31 5px, transparent 5px, transparent 9px)",
        "kantha-cross":
          "repeating-linear-gradient(45deg, transparent, transparent 4px, #E8A317 4px, #E8A317 5px, transparent 5px, transparent 9px), repeating-linear-gradient(-45deg, transparent, transparent 4px, #E8A317 4px, #E8A317 5px, transparent 5px, transparent 9px)",
        "kantha-dots":
          "radial-gradient(circle, #C84B31 1px, transparent 1px)",
        "kantha-wave":
          "repeating-linear-gradient(90deg, #D4789C 0px, #D4789C 1px, transparent 1px, transparent 6px, #D4789C 6px, #D4789C 7px, transparent 7px, transparent 12px)",
      },
      backgroundSize: {
        "kantha-sm": "10px 10px",
        "kantha-md": "16px 16px",
        "kantha-lg": "24px 24px",
      },
      borderWidth: {
        3: "3px",
      },
      boxShadow: {
        parchment: "0 2px 12px rgba(45, 27, 14, 0.08)",
        terracotta: "0 4px 20px rgba(200, 75, 49, 0.15)",
        golden: "0 4px 20px rgba(232, 163, 23, 0.15)",
      },
      borderRadius: {
        kantha: "12px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
