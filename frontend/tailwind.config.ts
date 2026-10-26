import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {
    colors: { navy: "#172B57", purple: "#7165C6", lavender: "#F0EDFF", canvas: "#F7F8FC", ink: "#1F2937", muted: "#6B7280" },
    boxShadow: { card: "0 5px 24px rgba(22, 36, 75, 0.055)", float: "0 18px 40px rgba(22, 36, 75, 0.13)" },
    borderRadius: { card: "22px" },
    fontFamily: { sans: ['Pretendard', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI', 'sans-serif'] }
  } },
  plugins: []
};
export default config;
