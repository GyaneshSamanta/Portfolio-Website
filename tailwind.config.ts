import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-instrument-serif)", "Iowan Old Style", "Palatino Linotype", "Times New Roman", "serif"],
      },
      colors: {
        // shadcn-compatible aliases (kept for existing components)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Portfolio v2 semantic tokens (DESIGN.md §3.1)
        bg: {
          base: "hsl(var(--bg-base))",
          elevated: "hsl(var(--bg-elevated))",
          card: "hsl(var(--bg-card))",
          "card-hover": "hsl(var(--bg-card-hover))",
        },
        fg: {
          primary: "hsl(var(--fg-primary))",
          secondary: "hsl(var(--fg-secondary))",
          tertiary: "hsl(var(--fg-tertiary))",
        },
        brand: {
          DEFAULT: "hsl(var(--brand-purple))",
          purple: "hsl(var(--brand-purple))",
          pink: "hsl(var(--brand-pink))",
          violet: "hsl(var(--brand-violet))",
          magenta: "hsl(var(--brand-magenta))",
          // legacy aliases used by existing components
          light: "hsl(var(--brand-accent-light))",
          dim: "hsl(var(--brand-accent-dim))",
          foreground: "hsl(var(--brand-accent-foreground))",
        },
        signal: {
          live: "hsl(var(--signal-live))",
          warn: "hsl(var(--signal-warn))",
          info: "hsl(var(--signal-info))",
        },
        "border-subtle": "hsl(var(--border-subtle))",
        "border-strong": "hsl(var(--border-strong))",
        "border-glow": "hsl(var(--border-glow))",
      },
      borderRadius: {
        // 24px / 16px / 8px — DESIGN.md §3.4
        "3xl": "1.5rem",
        "2xl": "1rem",
        xl: "0.75rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      transitionTimingFunction: {
        // DESIGN.md §3.6 motion tokens
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "swift": "cubic-bezier(0.32, 0.72, 0, 1)",
        // Apple iOS 26 spring-physics approximation (overshoot 1.56)
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "apple-smooth": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      letterSpacing: {
        // Apple type system tracking
        "display": "-0.022em",
        "headline": "-0.018em",
        "body-tight": "-0.011em",
      },
      transitionDuration: {
        "motion-fast": "200ms",
        "motion-base": "400ms",
        "motion-slow": "800ms",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - 2rem))" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(calc(-100% - 2rem))" },
          to: { transform: "translateX(0)" },
        },
        // Clean -50% loop. Assumes the list is rendered exactly TWICE as
        // siblings of equal width (no gap between the two copies). A -50%
        // translate puts the second copy exactly where the first started,
        // so the visible window sees a seamless infinite scroll.
        "marquee-clean": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-clean-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        "gradient-flow": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.4)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 40s linear infinite",
        "marquee-reverse": "marquee-reverse 40s linear infinite",
        "marquee-clean": "marquee-clean 90s linear infinite",
        "marquee-clean-reverse": "marquee-clean-reverse 90s linear infinite",
        "marquee-clean-slow": "marquee-clean 80s linear infinite",
        "marquee-clean-slow-reverse": "marquee-clean-reverse 80s linear infinite",
        "gradient-flow": "gradient-flow 6s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
