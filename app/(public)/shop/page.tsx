import { buildMetadata } from "@/lib/seo/metadata";
import Image from "next/image";
import Link from "next/link";
import { INSTAGRAM_URL } from "@/lib/constants/social";

export const metadata = buildMetadata({
  title: "Shop — Coming Soon",
  description: "Ubasti merchandise and gifts coming soon. Follow us on Instagram for the latest updates.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24"
      style={{ background: "var(--ubasti-cream)" }}>
      <div className="relative w-20 h-20 rounded-full overflow-hidden mb-6">
        <Image src="/images/placeholders/Ubasti Symbol_Pink.jpg" alt="Ubasti" fill className="object-cover" />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--ubasti-mustard)" }}>
        Coming Soon
      </p>
      <h1 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-ink)", fontWeight: 600 }}>
        Shop
      </h1>
      <p className="text-base max-w-md mb-8" style={{ color: "var(--ubasti-sage)" }}>
        Ubasti merchandise — totes, mugs, prints, and cat-inspired gifts — is on its way. Follow us on Instagram for the first drop.
      </p>
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
        className="inline-flex h-12 items-center px-8 rounded-full font-medium text-sm transition-opacity hover:opacity-90"
        style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}>
        @ubasticatcafe on Instagram
      </a>
      <Link href="/" className="mt-6 text-sm underline underline-offset-4" style={{ color: "var(--ubasti-sage)" }}>
        Back to Home
      </Link>
    </div>
  );
}
