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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ubasticats.com";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  "@id": `${APP_URL}/#business`,
  name: "Ubasti Cat Cafe & Lounge",
  description: "Serene cat cafe & adoption lounge in Chennai. Sip coffee, cuddle cats, find your forever friend.",
  url: APP_URL,
  image: {
    "@type": "ImageObject",
    url: `${APP_URL}/og/default.png`,
    width: 1200,
    height: 630,
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Chennai",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 13.0827, longitude: 80.2707 },
  telephone: "+919445077270",
  priceRange: "₹",
  servesCuisine: "Coffee, Tea, Light Bites",
  acceptsReservations: true,
  paymentAccepted: "Cash, UPI, Credit Card",
  currenciesAccepted: "INR",
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "11:00", closes: "19:00" },
  ],
  sameAs: [
    "https://www.instagram.com/ubasticatcafe?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${APP_URL}/#website`,
  url: APP_URL,
  name: "Ubasti Cat Cafe & Lounge",
  publisher: { "@id": `${APP_URL}/#business` },
};

export const metadata: Metadata = {
  title: {
    default: "Ubasti Cat Cafe & Lounge | Chennai",
    template: "%s | Ubasti Cat Cafe & Lounge",
  },
  description:
    "Sip specialty coffee, cuddle resident rescue cats, and find your forever friend at Ubasti — Chennai's serene cat cafe & adoption lounge.",
  metadataBase: new URL(APP_URL),
  openGraph: {
    locale: "en_IN",
    siteName: "Ubasti Cat Cafe & Lounge",
    images: [{ url: `${APP_URL}/og/default.png`, width: 1200, height: 630, alt: "Ubasti Cat Cafe & Lounge — Chennai" }],
  },
  twitter: { card: "summary_large_image" },
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
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
