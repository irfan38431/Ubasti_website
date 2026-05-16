import Link from "next/link";

export function Footer() {
  return (
    <footer
      className="py-14 md:py-20"
      style={{ background: "var(--ubasti-olive-dark)", color: "var(--ubasti-cream)" }}
    >
      <div className="max-w-[640px] mx-auto px-6 flex flex-col items-center gap-6 text-center">
        {/* Instagram handle — largest element */}
        <a
          href="https://instagram.com/ubasti.cafe"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-opacity hover:opacity-75"
          style={{
            fontFamily: "var(--font-caveat)",
            fontSize: "2.5rem",
            fontStyle: "italic",
            color: "var(--ubasti-cream)",
            letterSpacing: "0.02em",
          }}
        >
          @ubasti.cafe
        </a>

        {/* Connect with US heading */}
        <h2
          className="text-3xl md:text-4xl"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--ubasti-cream)", fontWeight: 600 }}
        >
          Connect with US
        </h2>

        {/* Divider */}
        <div className="w-16 h-px opacity-30" style={{ background: "var(--ubasti-cream)" }} />

        {/* Inline link row */}
        <nav aria-label="Footer quick links" className="flex items-center gap-4 text-sm opacity-75">
          <Link href="/about" className="hover:opacity-100 transition-opacity">about</Link>
          <span aria-hidden="true">·</span>
          <a
            href="https://instagram.com/ubasti.cafe"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-100 transition-opacity"
          >
            connect
          </a>
          <span aria-hidden="true">·</span>
          <Link href="/waiver" className="hover:opacity-100 transition-opacity">waiver</Link>
        </nav>

        {/* Copyright */}
        <p
          className="text-xs opacity-50 italic"
          style={{ fontVariant: "small-caps", letterSpacing: "0.05em" }}
        >
          © {new Date().getFullYear()} UBASTI CAT CAFE &amp; LOUNGE
        </p>

        {/* Adoption Application link */}
        <a
          href="#" // TODO: link to adoption application page when available
          className="text-sm underline underline-offset-4 opacity-75 hover:opacity-100 transition-opacity"
          style={{ color: "var(--ubasti-blush)" }}
        >
          Adoption Application
        </a>

        {/* Bottom mini-nav */}
        <nav aria-label="Site navigation" className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs opacity-60 pt-2">
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
    </footer>
  );
}
