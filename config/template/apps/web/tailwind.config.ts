import type { Config } from "tailwindcss";
import eldora from "@fitted/ui-eldora/plugin.cjs";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}","../../packages/ui-shadcn/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors:{
        brand: "rgb(var(--brand))",
        ink: "rgb(var(--ink))",
        sub: "rgb(var(--sub))",
        line: "rgb(var(--line))",
        card: "rgb(var(--card))",
        bg: "rgb(var(--bg))"
      },
      borderRadius: { DEFAULT: "var(--radius)" }
    }
  },
  plugins: [eldora]
};
export default config;
