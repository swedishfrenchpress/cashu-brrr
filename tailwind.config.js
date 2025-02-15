/** @type {import('tailwindcss').Config} */
export default {
  daisyui: {
    themes: [
      {
        light: {
          primary: "#4F46E5",
          secondary: "#6366F1",
          accent: "#818CF8",
          neutral: "#1F2937",
          "base-100": "#FFFFFF",
          "base-200": "#F9FAFB",
          "base-300": "#F3F4F6",
          info: "#60A5FA",
          success: "#34D399",
          warning: "#FBBF24",
          error: "#EF4444",
        },
      },
    ],
  },
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      },
      borderRadius: {
        'card': '0.75rem',
      },
    },
  },
  plugins: [require("daisyui")],
};
