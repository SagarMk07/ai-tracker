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
                background: "#070B14",
                foreground: "#F8FAFC",
                surface: "#0F172A",
                accent: "#6366F1",
                secondary: "#1E293B",
                muted: "#64748B",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
            },
            animation: {
                "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "spin-slow": "spin 8s linear infinite",
                "float": "float 10s ease-in-out infinite",
                "float-slow": "float 15s ease-in-out infinite",
                "fade-in": "fadeIn 1s ease-out forwards",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0) translateX(0)" },
                    "50%": { transform: "translateY(-20px) translateX(10px)" },
                },
                fadeIn: {
                    from: { opacity: "0", transform: "translateY(10px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "glass-gradient": "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))",
            },
        },
    },
    plugins: [],
};
