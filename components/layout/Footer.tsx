import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer
      className="py-10 md:py-14"
      style={{ background: "var(--ubasti-ink)", color: "var(--ubasti-cream)" }}
    >
      <div className="max-w-[640px] mx-auto px-6 flex flex-col items-center gap-4 text-center">
        {/* Brand symbol */}
        <div className="relative w-14 h-14 rounded-full overflow-hidden mb-1">
          <Image
            src="/images/placeholders/Ubasti Symbol_Pink.jpg"
            alt="Ubasti"
            fill
            className="object-cover"
          />
        </div>
        {/* Inline link row */}
        <nav aria-label="Footer quick links" className="flex items-center gap-3 text-sm opacity-70">
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
          style={{ letterSpacing: "0.05em" }}
        >
          © {new Date().getFullYear()} UBASTI CAT CAFE &amp; LOUNGE
        </p>

        {/* Adoption Application link */}
        <a
          href="#"
          className="text-sm underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: "var(--ubasti-blush)" }}
        >
          Adoption Application
        </a>
      </div>
    </footer>
  );
}
