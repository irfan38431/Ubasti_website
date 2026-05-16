import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Inter, Caveat, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/lib/contexts/providers";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "Ubasti Cat Cafe & Lounge",
  description: "Serene cat cafe & adoption lounge in Chennai. Sip coffee, cuddle cats, find your forever friend.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://ubasti.cafe",
  image: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://ubasti.cafe"}/images/placeholders/hero-cat-portrait.svg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 13.0827, longitude: 80.2707 },
  telephone: "+919445077270",
  priceRange: "₹",
  servesCuisine: "Coffee, Tea, Light Bites",
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "11:00", closes: "19:00" },
  ],
  sameAs: [],
};

export const metadata: Metadata = {
  title: "Ubasti — Cat Cafe & Lounge | Chennai",
  description:
    "Serene cat cafe & adoption lounge in Chennai. Sip coffee, cuddle cats, find your forever friend.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: { locale: "en_IN" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={[
        cinzel.variable,
        cormorant.variable,
        inter.variable,
        caveat.variable,
        jetbrains.variable,
        "h-full",
      ].join(" ")}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <Providers>
          <div id="main-content" className="flex-1 flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
