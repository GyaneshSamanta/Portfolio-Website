import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SITE_CONFIG } from "@/lib/constants";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { CursorCircle } from "@/components/ui/cursor-circle";
import { NoiseTexture } from "@/components/ui/noise-texture";
import { ProgressRail } from "@/components/ui/progress-rail";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/images/brand/newsletter-cover.png",
    shortcut: "/images/brand/newsletter-cover.png",
    apple: "/images/brand/newsletter-cover.png",
  },
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    // The image array intentionally omits an explicit URL — Next.js App Router
    // discovers `app/opengraph-image.tsx` and auto-injects the right meta tags
    // pointing at /opengraph-image.png. Specifying width/height/alt here gives
    // LinkedIn/Twitter/WhatsApp the dimensions to reserve space immediately.
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: ["/opengraph-image"],
    creator: SITE_CONFIG.twitterHandle,
    site: SITE_CONFIG.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "OfG6sDJi-YcRjydEObMm8L3Vf-YTewROh4jP31pCBW8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Person schema — gives Google enough structured signal to surface
  // a rich result (knowledge-panel-style) when someone searches the name.
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    image: `${SITE_CONFIG.url}/images/hero/headshot.jpg`,
    jobTitle: "Product Manager",
    description: SITE_CONFIG.description,
    sameAs: [
      SITE_CONFIG.links.linkedin,
      SITE_CONFIG.links.github,
      SITE_CONFIG.links.youtube,
      SITE_CONFIG.links.newsletter,
    ],
    knowsAbout: [
      "Product Management",
      "Data Storytelling",
      "Consumer Behaviour",
      "Artificial Intelligence",
      "B2B SaaS",
      "Outbound Product Management",
    ],
    alumniOf: [
      { "@type": "EducationalOrganization", name: "Xavier Institute of Management Bhubaneswar" },
      { "@type": "EducationalOrganization", name: "SRM Institute of Science and Technology" },
    ],
    worksFor: { "@type": "Organization", name: "Ginesys" },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} relative font-sans antialiased bg-bg-base text-fg-primary min-h-screen flex flex-col selection:bg-brand-magenta/40 selection:text-fg-primary`}
      >
        {/* Site-wide ambient gradient — subtle, sits behind everything. Two
            radial gradients positioned in opposite corners give the dark
            background some depth without competing with section content. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-20"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 80% 0%, hsl(var(--brand-magenta) / 0.10), transparent 55%), radial-gradient(ellipse 70% 60% at 10% 90%, hsl(var(--brand-violet) / 0.10), transparent 55%), linear-gradient(180deg, #0A0820 0%, #0F0C28 50%, #0A0820 100%)",
          }}
        />
        {/* Skip link — keyboard users land here first (DESIGN.md §9). */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-magenta focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>

        <NoiseTexture />
        <ProgressRail />
        <CursorCircle />
        <SmoothScroll>
          <LoadingScreen>
            <Navbar />
            <main id="main" className="flex-1 selection:bg-brand-magenta/40">
              {children}
            </main>
            <Footer />
          </LoadingScreen>
        </SmoothScroll>

        {/* Cal.com embed — lazy loaded for better Core Web Vitals. */}
        <Script id="cal-embed" strategy="lazyOnload">
          {`(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
          Cal("init", "15min", {origin:"https://app.cal.com"});
          Cal.ns["15min"]("ui", {"theme":"dark","hideEventTypeDetails":false,"layout":"month_view"});`}
        </Script>
        <SpeedInsights />
      </body>
    </html>
  );
}
