import Image from "next/image";
import Link from "next/link";

export function BottomNavigationBlock() {
  return (
    <div
      className="flex flex-col items-center text-center"
      style={{ background: "var(--ubasti-ink)", color: "var(--ubasti-cream)" }}
    >
      {/* Divider */}
      <div className="w-24 h-px opacity-20 mt-2" style={{ background: "var(--ubasti-cream)" }} />

      {/* Large Instagram handle */}
      <a
        href="https://instagram.com/ubasti.cafe"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 block transition-opacity hover:opacity-75 px-6"
        style={{
          fontFamily: "var(--font-caveat)",
          fontSize: "clamp(2rem, 6vw, 3.5rem)",
          fontStyle: "italic",
          color: "var(--ubasti-cream)",
          letterSpacing: "0.02em",
        }}
      >
        @ubasti.cafe
      </a>

      {/* Repeated Connect with US heading */}
      <h2
        className="mt-4 px-6 text-3xl md:text-4xl"
        style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-cream)", fontWeight: 600 }}
      >
        Connect with US
      </h2>

      {/* Full-width feature photograph */}
      <div className="relative w-full mt-8" style={{ aspectRatio: "21/9", maxHeight: "420px" }}>
        <Image
          src="/images/placeholders/offering-community.svg"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
          sizes="100vw"
        />
      </div>

      {/* Bottom mini-nav row */}
      <nav
        aria-label="Site navigation"
        className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs py-6 px-6 opacity-60"
      >
        <Link href="/" className="hover:opacity-100 transition-opacity">Home</Link>
        <span aria-hidden="true">·</span>
        <Link href="/about" className="hover:opacity-100 transition-opacity">About</Link>
        <span aria-hidden="true">·</span>
        <Link href="/book" className="hover:opacity-100 transition-opacity">Book</Link>
        <span aria-hidden="true">·</span>
        <Link href="/kitties" className="hover:opacity-100 transition-opacity">Kitties</Link>
        <span aria-hidden="true">·</span>
        <Link href="/blog" className="hover:opacity-100 transition-opacity">Blog</Link>
      </nav>
    </div>
  );
}
